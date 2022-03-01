const activeWindow = require('active-win');
const { Client } = require("openrgb-sdk")

const frequency_ms = 1000; //title update frequency
const target_names = ['Vivaldi.exe', 'Discord', 'Plex.exe'] //window names that will be targeted to try to switch to the profile with the same name

const enableDefaultProfile = true; //Will switch to default profile if no profile for given window
const defaultProfile = 'a'; //said default profile

let currentProfile;
let windowName;

async function start () {
	const client = new Client("Example", 6742, "localhost")
	
	await client.connect()
    const profileList = await client.getProfileList();
    console.log('List of profiles: ', profileList);

    setInterval(async () => {
        
        let win = await activeWindow({});
        if (win.owner.name !== windowName) {
            console.log('Current window name: ' + win.owner.name);
            windowName = win.owner.name;
        }
        
        profileList.some(p => {
            if (p == windowName && target_names.some(t => t == windowName) && currentProfile !== p) {
                console.log('Setting profile to: ' + p);
                currentProfile = p;
                client.loadProfile(currentProfile);
            }
            if (!(p == windowName || target_names.some(t => t == windowName)) && enableDefaultProfile && currentProfile !== defaultProfile) {
                console.log('Setting profile to default')
                currentProfile = defaultProfile;
                client.loadProfile(currentProfile);
            }
        });
      }, frequency_ms);

      [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `SIGTERM`].forEach((eventType) => {
        process.on(eventType, function () {
            client.loadProfile(defaultProfile);
            process.exit();
        });
      })
}

start()