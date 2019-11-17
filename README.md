<div align="center">
  <br />
  <p>
    <a href="https://github.com/Chokyotager/La-Cosa-Nostra"><img src="/display/generic-banner-2.png" alt="banner" /></a>
  </p>
  <br />
  <p>
    <a href="https://discord.gg/9ecwAR9"><img src="https://discordapp.com/api/guilds/472948229839912960/embed.png" alt="Discord server" /></a>
    <a href="https://snyk.io/test/github/Chokyotager/La-Cosa-Nostra"><img src="https://snyk.io/test/github/Chokyotager/La-Cosa-Nostra/badge.svg?targetFile=package.json" alt="Vulnerabilities" /></a>
    <a href="https://david-dm.org/Chokyotager/La-Cosa-Nostra"><img src="https://david-dm.org/Chokyotager/La-Cosa-Nostra/status.svg" alt="Dependencies" /></a>
  </p>
</div>

## About
**Bringing real-time Mafia to Discord.** Forum Mafia has always been an interesting game. La Cosa Nostra is my attempt in bringing the charged zero-sum strategic mafia party game into Discord, all while keeping everything automated and requiring no human intervention. It is coded in JavaScript.


## Installation and configuration using NPM
1. Install the LCN package using `npm install la-cosa-nostra`.
2. Create a bot-token and a Discord bot (guide [here](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)).
3. Add your bot to the server using this link: `https://discordapp.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot&permissions=8` - swap the `CLIENT_ID` out for the ID of your bot.
4. Copy and paste this code below into a script file in a directory (i.e. `lcn/run.js`):

```js
var lcn = require("la-cosa-nostra");

var config = {
   "bot-token": "<token>",
   "server-id": "<server ID>"
   // Other configuration parameters as you like
};

var lcnbot = new lcn.Bot(config);
lcnbot.start();
```

3. Run the script.
4. For a more detailed guide and information on installation, as well as configurable fields, [visit our Wiki](https://github.com/Chokyotager/La-Cosa-Nostra/wiki).
5. [Join our Discord](https://discord.gg/9ecwAR9) or [ask on the forums](https://chocoparrot.com/forum/) if you require assistance in installation.

## Features and preview
![Game trial](/display/game-trial.png)


`Emote based votes`

![Role-specific commands](/display/doctor-heal.png)


`Role-specific commands - a player with a doctor role healing another player`

![Auto declare](/display/win-declaration.png)


`Completely automatic - from actions to transitions to win declarations`

![Custom game flavours](/display/custom-setups.png)


`Custom game flavours and text - individual roles may be customised easily to suit a "theme" without having to change the role's code - the bot also allows for expansion packs which are essentially drag-and-drop setups`

## Installation and configuration using bot instance (manual)
Clone or download the bot repository and run it remotely on your server. The minimum Node version for this bot is `10.15.0`.

I strongly recommend using PM2 (http://pm2.keymetrics.io/) as the process manager to keep this bot running smoothly (hopefully) on your server.

You will also need to create a bot user on Discord and add it to your server. I suggest reading this guide: https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

Dependencies are listed in `package.json`. Other packages used by this module should come pre-installed with Node.

Configure the bot through the `/configs` file. Make sure you insert your **bot token and server ID** in `/configs/configuration.json`. The other configuration options should hopefully be pretty self-explanatory.

Launch `bot.js` from Node once you are ready.

For a more detailed guide on installation, [visit our Wiki](https://github.com/Chokyotager/La-Cosa-Nostra/wiki). For technical support, [ask on the forums](https://chocoparrot.com/forum) or add me on Discord.

## Expansion packs
Ever since the Foxgloves update, the bot is able to accept *expansion packs*. These are individual folders which can contain custom roles, attributes, banners, flavours and even *entire setups*. They can be copied, pasted, rely on dependencies and shared between users easily, and anyone using the bot can load them.

Some of the default expansion packs that come with the bot include (as listed in `/expansions`):

`conspiracy-channels` - adds conspiracy channels - a form of group private communication in games

`forum-auxiliaries` - adds Mafia factional kill and basic one-attack protection

`lcn-expansion-1` & `lcn-expansion-2` - expansion packs

`lcn-modular-base` - expansion pack for modular roles

`you-die-you-lose` - self-explanatory

`the-anarchy-of-sol`, `zodiac-mafia`, `the-bluerose-hospital` & `Duvocation` - closed setups, designed by myself with a few other hosts

`c9++` - the C9++ semi-open game by Fiasco [as seen in Mafiascum](https://wiki.mafiascum.net/index.php?title=C9%2B%2B)

`primrose-c9++` - an expanded C9++ setup

`expanded-primrose-c9++` - a further expanded C9++ setup but for 21 players

`knight-errant` - an 18 player blind setup that is generated through a knight move.

`2d3` - a 9 player beginner setup as seen on Mafiascum.

`plaguetools` - a utility expansion pack for the plaguebearer

`compmeme` - memes for your computer needs, sorry Silicon Valley!

`meme` - old LCN memes

Simply go to `/configs/playing.json` and add your expansion pack as a list like such to load it:
```js
{
  "playing": {
    "players": "auto",

    "roles": null,

    "expansions": ["c9++"],
    "shuffle": true,
    "flavour": null

  }
}
```

*Note that `roles` is set to `null` so the expansion pack can automatically assign roles.*

## Wiki, Guides, and Developers
For a more detailed guide on installation, how to make your own roles and setups, and the lot, **visit our Wiki** at https://github.com/Chokyotager/La-Cosa-Nostra/wiki

We also have a forum dedicated to the LCN community. If you are a developer wanting to ask some development questions or to share your expansion packs, or if you just want to advertise your LCN server, go here: https://chocoparrot.com/forum

## Credits
**Authors:** ChocoParrot & Hex4Nova

**Alpha testers:** Justin (SpikedCoffee), Lia

**Beta testers:** Ardvark8op, ShapeShifted, Les (Fantome), Lia, Misode, Conjurer, Good Skele, Hex4Nova, Inffy

**Special thanks:** Error, Fogalog, Inffy, Randium, Sai Kurogetsu, Alisha

## Contact
Add me as a friend!

Discord: ChocoParrot#8925
