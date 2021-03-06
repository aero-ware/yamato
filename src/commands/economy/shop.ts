import { AeroEmbed, utils } from "@aeroware/aeroclient";
import { Command } from "@aeroware/aeroclient/dist/types";
import ships from "../../database/models/ship";
import users from "../../database/models/user";
import weapons from "../../database/models/weapon";

export default {
    name: "shop",
    aliases: ["market", "items", "view"],
    args: true,
    usage: "<weapons/ships/extras>",
    description: "Displays item info neatly in a pagination.",
    details: "Only displays items you unlocked.",
    category: "economy",
    cooldown: 5,
    async callback({ message, args }) {
        const user = (await users.findById(message.author.id))!;

        const color = Math.floor(Math.random() * 16777215).toString(16);

        switch (args[0]) {
            case "weapons":
                return utils.paginate(
                    message,
                    (
                        await weapons.find({
                            levelRequired: {
                                $lte: user.level,
                            },
                        })
                    )
                        .sort((a, b) =>
                            a.levelRequired === b.levelRequired
                                ? a.type === b.type
                                    ? a.cost - b.cost
                                    : a.type === "MEDIUM"
                                    ? b.type === "HEAVY"
                                        ? -1
                                        : b.type === "MEDIUM"
                                        ? 0
                                        : 1
                                    : a.type.length - b.type.length
                                : a.levelRequired - b.levelRequired
                        )
                        .map((w) =>
                            new AeroEmbed()
                                .setTitle(w.name)
                                .setDescription(w.description)
                                .twoByTwo([
                                    [
                                        {
                                            name: "Damage",
                                            value: w.damage,
                                        },
                                        {
                                            name: "Type",
                                            value: w.type.toLowerCase(),
                                        },
                                    ],
                                    [
                                        {
                                            name: "Effect",
                                            value: w.effect.toLowerCase(),
                                        },
                                        {
                                            name: "Cost",
                                            value: w.cost,
                                        },
                                    ],
                                ])
                                .addField(
                                    "Weapon details",
                                    `Deviation: ${
                                        w.deviation
                                    } damage\nCrit chance: ${w.critChance.toFixed(2)}%`
                                )
                                .setColor(color)
                        ),
                    {
                        fastForwardAndRewind: {
                            time: 10000,
                        },
                        goTo: {
                            time: 10000,
                        },
                        time: 120000,
                    }
                );
            case "ships":
                return utils.paginate(
                    message,
                    (
                        await ships.find({
                            levelRequired: {
                                $lte: user.level,
                            },
                        })
                    )
                        .sort((a, b) => a.levelRequired - b.levelRequired)
                        .map((s) =>
                            new AeroEmbed()
                                .setTitle(s.name)
                                .setDescription(s.description)
                                .twoByTwo([
                                    [
                                        {
                                            name: "Health",
                                            value: s.health,
                                        },
                                        {
                                            name: "Class",
                                            value: s.class.toLowerCase(),
                                        },
                                    ],
                                    [
                                        {
                                            name: "Speed",
                                            value: `${s.speed} knots`,
                                        },
                                        {
                                            name: "Cost",
                                            value: `${s.cost} coins`,
                                        },
                                    ],
                                ])
                                .addField(
                                    "Weapon slots",
                                    `Heavies: ${s.weapons.heavySlots}\nMediums: ${s.weapons.mediumSlots}\nLights: ${s.weapons.lightSlots}`
                                )
                                .setColor(color)
                        ),
                    {
                        fastForwardAndRewind: {
                            time: 10000,
                        },
                        goTo: {
                            time: 10000,
                        },
                        time: 120000,
                    }
                );
            case "extras":
                return message.channel.send(
                    new AeroEmbed()
                        .setTitle("Extras")
                        .setColor("RANDOM")
                        .threeByThree([
                            [
                                {
                                    name: "small exp boost",
                                    value: `Gives you a small exp boost.`,
                                },
                                {
                                    name: "exp boost",
                                    value: `Gives you an exp boost.`,
                                },
                                {
                                    name: "large exp boost",
                                    value: `Gives you a large exp boost.`,
                                },
                            ],
                            [
                                {
                                    name: "1 hour exp booster",
                                    value: `Great for a few battles.`,
                                },
                                {
                                    name: "4 hour exp booster",
                                    value: `Amazing for anything.`,
                                },
                                {
                                    name: "1 day exp booster",
                                    value: `One day of more exp!`,
                                },
                            ],
                            [
                                {
                                    name: "1 hour coin booster",
                                    value: `Great for a few battles.`,
                                },
                                {
                                    name: "4 hour coin booster",
                                    value: `Amazing for anything.`,
                                },
                                {
                                    name: "1 day coin booster",
                                    value: `One day of more coins!`,
                                },
                            ],
                        ])
                );
            default:
                return message.channel.send(
                    `You can only view \`weapons\`, \`ships\`, and \`extras\`.`
                );
        }
    },
} as Command;
