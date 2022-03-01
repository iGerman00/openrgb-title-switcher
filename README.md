# openrgb-title-switcher

This will switch the profile in OpenRGB based on window titles. It ignores any window titles that are not present in your openrgb profiles. It will attempt to switch to the profile with the same name as the window title. Check stdout to see current window names. You can also enable default profile switching for it to switch to a single profile every time there is no profile for your current window.

Setup: 
- Clone this repository
- Install node
- Customize config.json with any editor to suit your needs
- Use any method to launch this command in the cloned directory:
`node index.js`
- Keep the script running somehow, I suggest pm2
