const activeWindow = require("active-win");
const { Client } = require("openrgb-sdk");

const {
  update_frequency,
  enableDefaultProfile,
  defaultProfileName,
  server_port,
  server_host,
  start_delay_ms,
} = require("./config.json");

async function start() {
  const client = new Client("openrgb-title-switcher", server_port, server_host);

  try {
    await client.connect();
  } catch (error) {
    if (error.message.includes("ECONNREFUSED")) {
      console.log(
        "Connection refused. If OpenRGB is running and the server is started, check configuration"
      );
      return;
    }
    console.log(error);
    return;
  }

  const profileList = await client.getProfileList();
  console.log("List of profiles: ", profileList);

  let windowName = "";
  let currentProfile = "";

  setInterval(async () => {
    const win = await activeWindow({});
    if (win && win.owner.name.toLocaleLowerCase() !== windowName.toLocaleLowerCase()) {
      console.log("Current window name: " + win.owner.name.toLocaleLowerCase());
      windowName = win.owner.name.toLocaleLowerCase();
    }

    const isValidProfile = profileList.some((p) => {
      p = p.toLocaleLowerCase();
      if (p == windowName) {
        if (currentProfile !== p) {
          currentProfile = p;
          console.log("Setting profile: " + currentProfile);
          client.loadProfile(currentProfile);
        }
        return true;
      }
    });

    if (
      !isValidProfile &&
      enableDefaultProfile &&
      currentProfile !== defaultProfileName
    ) {
      console.log("Setting default profile");
      currentProfile = defaultProfileName;
      client.loadProfile(currentProfile);
    }
  }, update_frequency);

  [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, function () {
      client.loadProfile(defaultProfileName);
      process.exit();
    });
  });
  process.on("uncaughtException", (err) => {
    console.error(err);
  });
}

(function repeat() {
  if (start_delay_ms !== 0)
    console.log("Starting in " + start_delay_ms + " ms");
  setTimeout(() => {
    try {
      start();
    } catch (error) {
      repeat();
    }
  }, start_delay_ms); //startup delay to allow for openrgb to autostart
})();
