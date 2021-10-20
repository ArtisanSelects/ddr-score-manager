import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import Header from './components/Header';
import AddScore from './components/AddScore';
import AddSong from './components/AddSong';
import SongsList from './components/SongsList';
import SongDetail from './components/SongDetail';
import UpdateSong from './components/UpdateSong';
import Statistics from './components/Statistics';
import MiscScores from './components/MiscScores';
import AddMiscScore from './components/AddMiscScore';
import Homepage from './components/Homepage';
import About from './components/About';
import Login from './components/UserAuth/Login';
import Logout from './components/UserAuth/Logout';
import ErrorMessage from './components/ErrorMessage';

import statisticsCalculationService from './services/statisticsCalculationService';

import SongsDataService from './services/songsdataservice';
import UserAuthDataService from './services/userAuthDataService';
import { decode } from 'html-entities';

import './App.css';

function App() {

  const [songList, setSongList] = useState([]);
  const [statisticsDict, setStatisticsDict] = useState({});
  const [gotSongs, setGotSongs] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const location = useLocation();

  const windowTitles = {
    "/about": "About",
    "/miscscores/create": "Add a new miscellaneous score",
    "/miscscores": "Miscellaneous scores",
    "/stats": "Statistics",
    "/songs": "Scores",
    "/scores": "Scores",
    "/login": "Login",
    "/songs/create": "Add a new song",
  };
  const validPaths = Object.keys(windowTitles);

  useEffect(() => {
    if (validPaths.includes(location.pathname)) {
      document.title = `DDR Score Manager - ${windowTitles[location.pathname]}`;
    } else {
      document.title = "DDR Score Manager";
    }
  }, [location]);

  const checkAuth = async () => {
    try {
      const auth = await UserAuthDataService.checkAuth();
      setIsAuthed(auth.data.isAuthed);
    } catch (err) {
      setHasErrors(true);
    }
  }

  const retrieveSongs = async () => {
    setHasErrors(false);
    try {
      checkAuth();
      const response = await SongsDataService.getAllSongs();
      for (let song of response.data) {
        song.title = decode(song.title);
        song.artist = decode(song.artist);
        if (!song.score) {
          song.score = {
              marvellous: '-',
              perfect: '-',
              great: '-',
              good: '-',
              boo: '-',
              miss: '-',
              combo: '-',
              ok: '-',
              score: 0,
              grade: '-',
              status: 'Unplayed',
          };
        }
      }
      setSongList(response.data);
      setStatisticsDict(statisticsCalculationService(response.data));
      setGotSongs(true);
    } catch (err) {
      setHasErrors(true);
    }
  }

  useEffect(() => {
    retrieveSongs();
  }, []);




  return (
    <div className="App">
        <Header isAuthed={isAuthed} />
        {gotSongs ? (
          <Switch>
            <Route exact path='/' render={() => (
              <Homepage isAuthed={isAuthed} />
            )} />

            <Route exact path='/login' render={() => (
              <Login checkAuth={checkAuth} />
            )} />

            <Route exact path='/logout' render={() => (
              <Logout checkAuth={checkAuth} />
            )} />

            <Route exact path={['/scores', '/songs']} render={() => (
              <SongsList name="songslist" songList={songList} hasErrors={hasErrors} />
            )} />

            <Route exact path='/scores/:songID/create' render={(props) => (
              <AddScore updateSongs={retrieveSongs} isAuthed={isAuthed} match={props.match} />
            )} />

            <Route exact path='/songs/create' render={(props) => (
              <AddSong updateSongs={retrieveSongs} isAuthed={isAuthed} songList={songList} />
            )} />

            <Route exact path='/songs/:id' render={(props) => (
              <SongDetail updateSongs={retrieveSongs} isAuthed={isAuthed} match={props.match} />
            )} />

            <Route exact path='/songs/:id/update' render={(props) => (
              <UpdateSong updateSongs={retrieveSongs} isAuthed={isAuthed} match={props.match} />
            )} />

            <Route exact path='/stats' render={(props) => (
              <Statistics statisticsDict={statisticsDict} />
            )} />

            <Route exact path='/miscscores' render = {(props) => (
              <MiscScores updateSongs={retrieveSongs} isAuthed={isAuthed} />
            )} />

            <Route exact path='/miscscores/create' render={(props) => (
              <AddMiscScore updateSongs={retrieveSongs} isAuthed={isAuthed} />
            )} />

            <Route exact path='/about' render={(props) => (
              <About />
            )} />
            
          </Switch> ) : ( <div className="msg-container">
            {hasErrors ? (
              <ErrorMessage errorArray={[{ param: 'backend', msg:'Unable to access the database. Please try again later.' }]} />
            ) : <h2>Loading...</h2>}
            </div>
          ) }
    </div>
  );
}

export default App;
