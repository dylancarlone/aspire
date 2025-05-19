import { useState } from 'react';
import { Outlet, Link, useParams } from 'react-router';
import { useQuery, useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import AddIcon from '@mui/icons-material/Add';

import {
  GET_REPOSITORIES,
  ADD_REPOSITORY,
  SET_REPOSITORY_LATEST_RELEASE_SEEN,
  type Repository,
} from '../helpers/graphql';
import RepositoryCard from '../components/RepositoryCard';

function Repositories() {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  // Quick error state management, could be improved by Yup validation
  const [isRepositoryUrlDirty, setIsRepositoryUrlDirty] = useState(false);
  const {
    data: repositoriesData,
    loading: repositoriesLoading,
    error: repositoriesError,
    refetch: refetchRepositories,
  } = useQuery<{ repositories: [Repository] }>(GET_REPOSITORIES);
  const [
    addRepository,
    { loading: addRepositoryLoading, error: addRepositoryError },
  ] = useMutation(ADD_REPOSITORY);
  const [setRepositoryLatestReleaseSeen] = useMutation(
    SET_REPOSITORY_LATEST_RELEASE_SEEN
  );

  const { repositoryId: selectedRepositoryId } = useParams();

  const handleAddRepository = async () => {
    setIsRepositoryUrlDirty(false);
    await addRepository({ variables: { url: repositoryUrl } });
    setRepositoryUrl('');
    refetchRepositories();
  };

  const handleRepositoryUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRepositoryUrl(event.target.value);
    setIsRepositoryUrlDirty(true);
  };

  const handleSetLatestReleaseSeen = async (repositoryId: string) => {
    await setRepositoryLatestReleaseSeen({
      variables: { id: repositoryId },
    });
    refetchRepositories();
  };

  const showAddRepositoryError = !!addRepositoryError && !isRepositoryUrlDirty;

  return (
    <Box>
      <Typography variant="h4" sx={{ my: 3 }}>
        Repositories
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Add a repository URL to track its latest releases on GitHub.
      </Typography>
      <Stack direction="row" spacing={2} mb={4}>
        <TextField
          label="Repository URL"
          placeholder="Enter a GitHub repository URL"
          color="secondary"
          variant="outlined"
          value={repositoryUrl}
          error={showAddRepositoryError}
          helperText={showAddRepositoryError ? addRepositoryError.message : ''}
          onChange={handleRepositoryUrlChange}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          disabled={!repositoryUrl}
          loading={addRepositoryLoading}
          onClick={handleAddRepository}
          startIcon={<AddIcon />}
        >
          Add Repository
        </Button>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={4}>
          {repositoriesLoading && <CircularProgress />}
          {!repositoriesLoading && repositoriesData && (
            <Stack spacing={3}>
              {repositoriesData.repositories.map((repository) => (
                <Link
                  to={`/${repository.id}`}
                  key={repository.id}
                  style={{ textDecoration: 'none' }}
                >
                  <RepositoryCard
                    key={repository.id}
                    repository={repository}
                    isSelected={repository.id === selectedRepositoryId}
                    onSetLatestReleaseSeen={() =>
                      handleSetLatestReleaseSeen(repository.id)
                    }
                  />
                </Link>
              ))}
            </Stack>
          )}
        </Grid>
        <Grid size={8}>
          <Outlet />
        </Grid>
      </Grid>
      {repositoriesError && (
        <Typography color="error" sx={{ my: 2 }}>
          Error loading repositories: {repositoriesError.message}
        </Typography>
      )}
    </Box>
  );
}

export default Repositories;
