import { BrowserRouter, Routes, Route } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import {
  GET_REPOSITORIES,
  UPDATE_REPOSITORY_LATEST_RELEASES,
  RESET_REPOSITORY_LATEST_RELEASES,
} from './helpers/graphql';
import RepositoryDetails from './components/RepositoryDetails';
import Repositories from './pages/Repositories';
import AppBar from './components/AppBar';

function App() {
  const { refetch: refetchRepositories } = useQuery(GET_REPOSITORIES);
  const [updateRepositoryLatestReleases] = useMutation(
    UPDATE_REPOSITORY_LATEST_RELEASES
  );
  const [resetRepositoryLatestReleases] = useMutation(
    RESET_REPOSITORY_LATEST_RELEASES
  );

  const handleUpdateRepositoryLatestReleases = async () => {
    await updateRepositoryLatestReleases();
    refetchRepositories();
  };

  const handleResetRepositoryLatestReleases = async () => {
    await resetRepositoryLatestReleases();
    refetchRepositories();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          onUpdateRepositoryLatestReleases={
            handleUpdateRepositoryLatestReleases
          }
          onResetRepositoryLatestReleases={handleResetRepositoryLatestReleases}
        />
      </Box>
      <Container maxWidth="lg" sx={{ mb: 3 }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Repositories />}>
              <Route path=":repositoryId" element={<RepositoryDetails />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </>
  );
}

export default App;
