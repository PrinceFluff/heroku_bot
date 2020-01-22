const Discord = require('discord.js');
const client = new Discord.Client();

const get = require('get-file');

var Data = {};


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  function parseREADME() {
  let rawData = "";
  // fetch data from github
  get('prodzpod/-RorgMod', 'README.md', function(err, res) {
    if (err) return console.error(err);
    res.on('data', (d) => {
      rawData += d.toString()
    });
    res.on('close', function() { 
      res.end();
    });
  });

  // swap github "image" with discord emotes
  rawData.replace(/\!\[Energy\]\(http:\/\/tinyurl\.com\/IroncladEnergy\)/g, "<:red_energy:669488816142155800>")
  rawData.replace(/\!\[Energy\]\(http:\/\/tinyurl\.com\/SilentsEnergy\)/g, "<:green_energy:669488892998844437>")
  rawData.replace(/\!\[Energy\]\(http:\/\/tinyurl\.com\/DefectEnergy\)/g, "<:blue_energy:669488945997938688>")
  rawData.replace(/\!\[Energy\]\(http:\/\/tinyurl\.com\/WatcherEnergy\)/g, "<:purple_energy:669489067439947776>")
  rawData.replace(/\!\[Energy\]\(http:\/\/tinyurl\.com\/ColorlessEnergy\)/g, "<:colorless_energy:669489128651358208>")

  let match;

  // get Cards
  match = /\* \*\*(.+)\*\* \((.+), (.+), (.+), (.+)\)( \*\*\(.+\)\*\*)?\n  \* (.+)/g.exec(rawData);
  while (match != null) {
    Data[match[1]] = '**' + match[1] + '**\n' + match[2] + ' `' + match[3] + '` `' + match[4] + '` `' + match[5] + '`' + (match[6] || match[6].length ? ' **' + match[6] + '**' : '') + '\n' + match[6]
    match = myRegexp.exec(rawData);
  }

  // get Relics
  match = /\* \*\*(.+)\*\* \((.+), (.+), (.+), (.+)\)( \*\*\(.+\)\*\*)?\n  \* (.+)/g.exec(rawData);
  while (match != null) {
    Data[match[1]] = '**' + match[1] + '**\n`' + match[2] + '` `' + match[3] + '`' + (match[4] || match[4].length ? ' ' + match[4] : '') + '\n' + match[5]
    match = myRegexp.exec(rawData);
  }
}


});

client.on('message', msg => {function message(args) {
  let List = []; let exactMatch;
  let msg = args.replace(/\W/g, '').toLowerCase() // removes non-english letters so - and spaces are ignored, allows follow-up to be searched as follow up or followup
  for (let key in Data) {
    if (key.replace(/\W/g, '').toLowerCase() == msg) {
      exactMatch = key;
      break;
    }
    if (key.replace(/\W/g, '').toLowerCase().indexOf(msg) + 1) // indexOf returns -1 if search fails, -1 + 1 is 0 which is false
      List.push(key)
  }

  // lets get this brod
  if (exactMatch) message.channel.send(Data[exactMatch]); // exact matches are considered first
  else if (List.length == 0) // Nothing found
    message.channel.send("I couldn't find a card/relic named __" + args + "__. Maybe it's in the base game?")
  else if (List.length == 1) // Only 1 thing found
    message.channel.send(Data[List[0]]) // send that
  else if (List.length <= 5) // 5 is arbiturary
    message.channel.send("We found multiple card/relic related to that name. Try: \n**" + List.join("**\n **") + "**")
  else 
    message.channel.send("We found too many card/relics with that search term. Try putting in more letters.")
}
  
});

client.login(process.env.BOT_TOKEN);


