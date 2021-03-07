require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
let prefixes = []


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  prefixes = process.env.COMMAND_PREFIX.split(',').sort((a, b) => b.length - a.length)
});


client.on('message', async message =>{
  let prefix = ''
  if (prefixes.some(pr => {
    prefix = pr 
    return message.content.startsWith(pr.trim())
  })){
    const content = message.content.replace(prefix, "").trim()
  
    const results = []

    const rolls = content.split(" ")
    rolls.forEach( roll => {
      if(roll.includes('d')){
        let [multiplier, dice] = roll.split('d')
        if (multiplier === ''){
          multiplier = "1"
        }

        let result = []
        if(isNumeric(multiplier) && isNumeric(dice)){
          for (let i = 0; i < multiplier; i++){
              result.push(Math.floor(Math.random() * dice) + 1)
          }
        }
        results.push(result)
      }
    })

    const embed = new Discord.MessageEmbed()
      .setColor('#851314')
      .setTitle('Rolling dice. May the luck be in your favor.')
      .setDescription('Dovie\'andi se tovya sagain.')

    rolls.forEach((roll, index)=>{
      if (roll.includes('d')) {
        let [multiplier, dice] = roll.split('d')
        if (multiplier === '') {
          multiplier = "1"
        }
        if (isNumeric(multiplier) && isNumeric(dice)) {
          embed.addField(roll + ':', results[index].join(' '))
        }
      }
    })

    message.channel.send(embed)
  }
})

const isNumeric = str =>{
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

client.login(process.env.BOT_TOKEN);