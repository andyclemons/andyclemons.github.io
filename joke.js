const joke = document.querySelector('.joke');
const btn = document.getElementById('btn');
const jokeParagraph = document.querySelector('.joke p');

btn.addEventListener('click',getRandom);
getRandom();
async function getRandom(){
  const jokeRes = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      'Accept': 'application/json'
    }
  });
  const resJson = await jokeRes.json();
  jokeParagraph.innerHTML = resJson.joke;
}