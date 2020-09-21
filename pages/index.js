import Head from 'next/head'
import useSWR from 'swr';
import { useState } from 'react';

async function fetchResults(key) {
  try {
    const [username, apiKey, from, to] = key.split('/')
    let res = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=${username}&api_key=${apiKey}&format=json&from=${from}&to=${to}`)
    return (await res.json())['weeklytrackchart']['track'];
  }
  catch(err) {
    return [];
  }
}


export default function Home() {
  //const [data, setData] = useState({ weeklytrackchart: { track: [] }});
  const [apiKey, setApiKey] = useState('');
  const [username, setUsername] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data, error, isValidating } = useSWR(`${username}/${apiKey}/${from}/${to}`, fetchResults);

  return (
    <div className="container">
      <Head>
        <title>last.week</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          last.week
        </h1>

        <p className="description">
          yet another last.fm visualizer
        </p>

        <hr />

        API Key: <input type="text" defaultValue="" onChange={e => setApiKey(e.target.value)}></input><br />
        Username: <input type="text" defaultValue="au5ton" onChange={e => setUsername(e.target.value)}></input><br />
        From: <input type="date" defaultValue="2020-09-13" onChange={e => setFrom(new Date(e.target.value).valueOf() / 1000)}></input><br />
        To: <input type="date" defaultValue="2020-09-20" onChange={e => setTo(new Date(e.target.value).valueOf() / 1000)}></input><br />
        <button onClick={(e) => {
          e.preventDefault();
          handleClick().then(e => setData(e));
        }}>Update</button><br />

        <div className="grid">

          {isValidating === false && Array.isArray(data) ? data.map(e => <WeeklyTrack key={e['@attr']['rank']} track={e}/>) : 'Loading...'}

        </div>
      </main>

      <style jsx global>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          /*color: #0070f3;*/
          border-color: #0070f3;
        }

        .card h3 {
          /*margin: 0 0 1rem 0;*/
          margin: 0;
          font-size: 1.5rem;
        }

        .card p {
          /*margin: 0;*/
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .card .badge {
          color: #fff;
          background: #c5140f;
          padding: 0.25em 0.5em;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

        hr {
          width: 85%;
          border-block-start-color: transparent;
          border-bottom: 1px solid rgba(128,128,128,0.5);
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export async function WeeklyTrack(props) {
  return (
    <div className="card">
      <a href={props.track.url}><img src={props.track.image.reverse()[0]['#text']} /></a>
      <h3>{props.track.name}</h3>
      <p>
        <em>{props.track.artist['#text']}</em>
      </p>
      <span className="badge">{props.track.playcount} plays</span>
    </div>
  );
}