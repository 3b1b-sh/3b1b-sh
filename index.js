const username = "3b1b-sh";
const statCardVersion = "20260610-card4";

const thisYear = new Date().getUTCFullYear();
const startTimeOfThisYear = Date.UTC(thisYear, 0, 1, 0, 0, 0);
const endTimeOfThisYear = Date.UTC(thisYear, 11, 31, 23, 59, 59);
const progressOfThisYear =
  (Date.now() - startTimeOfThisYear) / (endTimeOfThisYear - startTimeOfThisYear);
const progressBarOfThisYear = generateProgressBar();

function generateProgressBar() {
  const progressBarCapacity = 30;
  const passedProgressBarIndex = Math.floor(progressOfThisYear * progressBarCapacity);
  const progressBar =
    "█".repeat(passedProgressBarIndex) +
    "▁".repeat(progressBarCapacity - passedProgressBarIndex);

  return `{ ${progressBar} }`;
}

const readme = `\
### Hi there 👋

⏳ Year progress ${progressBarOfThisYear} ${(progressOfThisYear * 100).toFixed(2)} %

---

⏰ Updated on ${new Date().toUTCString()}

![Progress Bar CI](https://github.com/${username}/${username}/actions/workflows/main.yml/badge.svg)

### My GitHub Contribution

<p align="center">
  <img src="https://raw.githubusercontent.com/${username}/${username}/output/github-contribution-grid-snake.svg" alt="GitHub contribution snake" />
</p>

<p align="center">
  <img width="800" src="https://capsule-render.vercel.app/api?type=waving&amp;color=timeGradient&amp;height=300&amp;section=header&amp;text=Hi%20There&amp;fontSize=90&amp;fontAlign=50&amp;fontAlignY=30&amp;desc=I%20am%20Eric%20Hu&amp;descAlign=50&amp;descSize=30&amp;descAlignY=60&amp;animation=twinkling" alt="Hi There" />
</p>

<p align="center">
  <a href="https://git.io/typing-svg">
    <img width="800" src="https://readme-typing-svg.demolab.com?font=Fira+Code&amp;size=30&amp;pause=1000&amp;center=true&amp;vCenter=true&amp;multiline=true&amp;width=1000&amp;height=100&amp;lines=Welcome+to+my+GitHub+profile+page!;I+hope+you+would+like+my+projects!" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <img align="center" width="400" src="https://raw.githubusercontent.com/${username}/${username}/master/assets/stats/github-stats.svg?v=${statCardVersion}" alt="GitHub stats" />
  <img align="center" width="400" src="https://streak-stats.demolab.com?user=${username}&amp;theme=transparent&amp;date_format=%5BY.%5Dn.j&amp;hide_border=true" alt="GitHub streak stats" />
  <br />
  <img width="800" src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&amp;theme=github-compact&amp;hide_border=true&amp;area=true" alt="GitHub activity graph" />
  <br />
  <img align="center" width="480" src="https://raw.githubusercontent.com/${username}/${username}/master/assets/stats/wakatime.svg?v=${statCardVersion}" alt="WakaTime stats" />
  <img align="center" width="320" src="https://raw.githubusercontent.com/${username}/${username}/master/assets/stats/top-langs.svg?v=${statCardVersion}" alt="Top languages" />
  <br />
  <img align="center" src="https://skillicons.dev/icons?i=github,py,c,cpp,md,vscode,matlab,bash,git,gitlab,docker,linux,powershell&amp;theme=light" alt="Skill icons" />
</p>

<p align="center">
  <a href="https://github.com/${username}"><img src="https://img.shields.io/badge/GitHub-${username}?logo=github" alt="GitHub profile" /></a>
  <img src="https://komarev.com/ghpvc/?username=${username}&amp;abbreviated=true&amp;color=yellow" alt="Profile views" />
</p>

<p align="center">
  <img width="800" src="https://capsule-render.vercel.app/api?type=waving&amp;color=timeGradient&amp;height=300&amp;section=footer&amp;text=The%20End&amp;fontSize=90&amp;fontAlign=50&amp;fontAlignY=70&amp;desc=Hope%20you%20have%20a%20nice%20day%20!&amp;descAlign=50&amp;descSize=30&amp;descAlignY=40&amp;animation=twinkling" alt="The End" />
</p>

`;

console.log(readme);
