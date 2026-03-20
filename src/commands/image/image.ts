import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { exec } from "node:child_process";

export default {
  data: new SlashCommandBuilder()
    .setName("morris")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("The search query")
        .setRequired(false),
    )
    .setDescription("Sends a random image of Morris"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const search = interaction.options.getString("search");
    if (search) {
      // use cURL to get the image, as it's faster than fetch
      // split on ", as otherwise encodeURIComponent breaks
      const splitItem = search.split('"');
      const proper = [
        encodeURIComponent(splitItem[0]),
        ...splitItem.slice(1),
      ].join('"');
      exec(
        "bash -c 'curl -s \"https://morrisapi.starnumber12046.workers.dev/morris/search?q=" +
          proper +
          "\"'",
        async (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          const images = (
            JSON.parse(stdout.trim()) as {
              images: { key: string }[];
            }
          ).images;

          const image = images[Math.floor(Math.random() * images.length)].key;
          const imageBufferResponse = await fetch(
            `https://morrisapi.starnumber12046.workers.dev/proxy/${image}`,
          );
          const imageBuffer = Buffer.from(
            await imageBufferResponse.arrayBuffer(),
          );
          await interaction.followUp({ files: [imageBuffer] });
        },
      );

      return;
    } else {
      const imageResponse = await fetch(
        "https://morrisapi.starnumber12046.workers.dev/morris",
      );
      const imageData = Buffer.from(await imageResponse.arrayBuffer());
      console.log(imageData.length);
      await interaction.followUp({ files: [imageData] });
    }
  },
};
