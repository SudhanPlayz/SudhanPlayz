const path = require("path");
const fetch = require("node-fetch");
const fs = require("fs");

let stars = 0,
  page = 1;

let special;

const fetchStars = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/users/SudhanPlayz/starred?per_page=100&page=${page}`
    );
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    const starsData = await response.json();
    return starsData;
  } catch (error) {
    console.error(`Error fetching stars data: ${error.message}`);
    return [];
  }
};

const countStars = async () => {
  let starsData = await fetchStars();
  stars += starsData.length;
  page++;
  if (starsData.length === 100) {
    await countStars();
  } else {
    await writeReadMe();
  }
};

const fetchUserData = async () => {
  try {
    const response = await fetch("https://api.github.com/users/SudhanPlayz");
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching user data: ${error.message}`);
    return null;
  }
};

const writeReadMe = async () => {
  const readMePath = path.join(__dirname, "..", "README.md");
  const date = new Date();
  const [dd, mm] = [date.getDate(), date.getMonth() + 1];

  if (mm === 12) special = ["⛄", "❄", "🎄"];
  else if (mm === 10 && dd === 31) special = ["👻", "🎃", "🍬"];
  else if (mm === 1 && dd === 1) special = ["🎉", "🥳", "🎆"];
  else if (mm === 9 && dd === 29) special = ["🎉", "🎈", "🎊"];
  else special = ["✨", "🚀", "✨"];

  const userData = await fetchUserData();
  if (!userData) return;

  const text = `## Hi there 👋 <img align="right" src="${userData.avatar_url}" width="200" />
I'm **Sudhan**, a developer from India. I like to code web applications and games. I have worked on many projects in my past, and some of my open-source projects are pinned below—make sure to check them out.

I work with various technologies, including TypeScript, JavaScript, API development, both backend and frontend. I use Prisma and Express for backend development and Next.js with TypeScript for full-stack applications. 

Additionally, I have experience with Discord bot development, Blockchain, Web3, and DApps, always trying to stay updated with new technologies.

Thanks for visiting my GitHub profile. Have a great day ahead!~

<h2 align="center"> ${special[0]} About Me ${special[0]}</h2>

\`\`\`js
const Sudhan = {
  FavouriteLanguage: "JavaScript/TypeScript",
  OpenedIssues: {{ ISSUES }},
  OpenedPullRequests: {{ PULL_REQUESTS }},
  TotalCommits: {{ COMMITS }},
  Stars: ${stars},
  Repositories: {
    Created: {{ REPOSITORIES }},
    Contributed: {{ REPOSITORIES_CONTRIBUTED_TO }}
  },
};
\`\`\`

<h2 align="center"> ${special[1]} My Stats ${special[1]}</h2>
<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=SudhanPlayz&theme=tokyonight">
  <img src="https://github-readme-stats.vercel.app/api?username=SudhanPlayz&theme=tokyonight&count_private=true&show_icons=true&include_all_commits=true">
</p>
<!-- Last updated on ${date.toString()} ;-;-->
<i>Last updated on ${dd}${getDateSuffix(dd)} ${date.toLocaleString('default', { month: 'long' })
    } ${date.getFullYear()} using magic</i> ${special[2]} ${mm === 9 && dd === 29 ? "and... today is my birthday" : ""
    }`;

  fs.writeFileSync(readMePath, text);
};

const getDateSuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

(async () => {
  await countStars();
})();
