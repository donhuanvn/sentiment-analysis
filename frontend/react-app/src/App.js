import { Route, Switch } from 'react-router-dom'

import SearchPage from './pages/SearchPage'
import VisualPage from './pages/VisualPage';

function App() {
  return (
    <div>
      <Switch>
        <Route path={['/', '/index.html']} exact>
          <SearchPage />
        </Route>
        <Route path='/history/:resultId'> {/* /history/:tweet_user_id */}
          <VisualPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
