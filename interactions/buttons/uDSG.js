const { Interaction } = require('discord.js')
const CommandsStats = require('../../database/commandsStats')
const DateStats = require('../../functions/dateStats')
const { getCardByUserType } = require('../../templates/loadingCard')
const { updateButtons } = require('../../functions/customType')
const { disabledOptions } = require('../../functions/pagination')
const { getTypeFromEmoji } = require('../../templates/customType')

/**
 * Update date stats graph.
 */
module.exports = {
  name: 'uDSG',
  async execute(interaction, json, newUser = false) {
    const commandName = await interaction.message.fetchReference()
      .then((message) => message.interaction.commandName)
      .catch(() => interaction.message.interaction.commandName)
    CommandsStats.create(commandName, `button - ${json.t.name}`, interaction)

    let components = interaction.message.components

    getCardByUserType(newUser, interaction)

    const resp = await DateStats.getCardWithInfo({
      interaction,
      values: json,
      type: json.t
    })

    // Select menu
    components.at(0).components.at(0).setDisabled(false)
    // Graph buttons
    components.at(1).components = updateButtons(components.at(1).components, json.t)
    // Pagination buttons
    components.at(2).components.forEach((button) => button.setDisabled(!!disabledOptions(json.cp, json.mp, getTypeFromEmoji(button.data.emoji.name))))

    resp.components = components

    return resp
  }
}
