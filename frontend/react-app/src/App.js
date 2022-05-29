import { Route, Switch } from 'react-router-dom'

import SocketProvider from './components/SocketContext/provider';
import SearchPage from './pages/SearchPage'
import VisualPage from './pages/VisualPage';

function App() {
  return (
    <SocketProvider>
      <Switch>
        <Route path={['/', '/index.html']} exact>
          <SearchPage />
        </Route>
        <Route path='/history/:resultId'> {/* /history/:tweet_user_id */}
          <VisualPage />
        </Route>
      </Switch>
    </SocketProvider>
  );
}

export default App;
