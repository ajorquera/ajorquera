const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${process.env.GH_PERSONAL_TOKEN}`
  }
});

const run = async () => {
  const stargazers = (await axiosInstance.get('/repos/ajorquera/ajorquera/stargazers')).data;
  const repo = (await axiosInstance.get('/repos/ajorquera/ajorquera/contents/README.md')).data;
  
  const readmeContent = Buffer.from(repo.content, 'base64').toString();

  const newContent = stargazers.map(user => {
    const {login, avatar_url} = user;

    return `<img alt="avatar ${login}" src="${avatar_url}" height="50" />`;
  }).join('');

  const newReadme = readmeContent.replace(/here\n\n.*/g, 'here\n\n' + newContent)

  let putRequest;
  try {
    putRequest = await axiosInstance.put('/repos/ajorquera/ajorquera/contents/README.md', { 
      message: 'update stargazers',
      sha: repo.sha,
      content: Buffer.from(newReadme).toString('base64')
    });
  } catch (e) {
    console.log(e);
  }

  process.exit(0);
};

run();