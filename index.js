require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
let roll_prefixes = []
let cl_prefixes = []


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  roll_prefixes = process.env.ROLL_PREFIX.split(',').sort((a, b) => b.length - a.length)
  cl_prefixes = process.env.CHALLENGE_LEVEL_PREFIX.split(',').sort((a, b) => b.length - a.length)
});


client.on('message', async message =>{
  let prefix = ''
  if (roll_prefixes.some(pr => {
    prefix = pr 
    return message.content.startsWith(pr.trim())
  })){
    const content = message.content.replace(prefix, '').trim()
  
    const results = []

    const rolls = content.split(' ')
    rolls.forEach( roll => {
      if(roll.includes('d')){
        let [multiplier, dice] = roll.split('d')
        if (multiplier === ''){
          multiplier = '1'
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

    if(results.length>0){
      rolls.forEach((roll, index)=>{
        if (roll.includes('d')) {
          let [multiplier, dice] = roll.split('d')
          if (multiplier === '') {
            multiplier = '1'
          }
          if (isNumeric(multiplier) && isNumeric(dice)) {
            embed.addField(roll + ':', results[index].join(' '))
          }
        }
      })
    } else{
      embed.addField('Usage:', prefix + ' <Amount of throws>d<how many sided dice>')
    }

    message.channel.send(embed)
  }
  if (cl_prefixes.some(pr => {
    prefix = pr
    return message.content.startsWith(pr.trim())
  })) {
    const content = message.content.replace(prefix, '').trim()

    const [level, dice] = content.split(' ')

    const embed = new Discord.MessageEmbed()
      .setColor('#851314')
      .setTitle('Rolling dice. Challenge level: ' + level)
      .setDescription('Dovie\'andi se tovya sagain.')

    const throws = []
    if(isNumeric(level) && isNumeric(dice)){
      let wins = 0

      for(let i = 0; i < dice; i++){
        const th = Math.floor(Math.random() * 6) + 1
        throws.push(th)
        th > 3 ? wins ++ : null
      }

      if(wins >= level){
        wins == dice ?
          embed.addField('CRITICAL SUCCESS! ' + dice + 'd6:', throws.join(' ')) :
          embed.addField('You success with ' + wins + ' successes. ' + dice +'d6:', throws.join(' ')) 
      } else{
        wins == 0 ?
          embed.addField('CRITICAL FAILURE! ' + dice + 'd6:', throws.join(' ')) : 
          embed.addField('You fail with ' + wins + ' successes. ' + dice + 'd6:', throws.join(' '))
      }
    }
    throws.length === 0 && embed.addField('Usage:', prefix + ' <level> <Number of dice>')
    
    message.channel.send(embed)
  }
})

const isNumeric = str =>{
  if (typeof str != 'string') return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

client.login(process.env.BOT_TOKEN);