import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';

import { GET_REPOSITORY } from '../helpers/graphql';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import type { Repository } from '../helpers/graphql';

type RepositoryDetailsProps = {
  repositoryId: string;
};

function RepositoryDetails() {
  const { repositoryId } = useParams<RepositoryDetailsProps>();
  const { loading, data } = useQuery<{ repository: Repository }>(
    GET_REPOSITORY,
    {
      variables: { id: repositoryId },
    }
  );

  if (!data || loading)
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  const { repository } = data;
  const { owner, name, description, latestReleaseTag, latestReleaseDate } =
    repository;

  return (
    <Paper sx={{ padding: 2 }}>
      <Stack spacing={3}>
        <Typography variant="h5">
          {owner}/{name}
        </Typography>
        <Typography>{description}</Typography>
        {latestReleaseTag && latestReleaseDate ? (
          <>
            <Typography variant="h5">
              <strong>
                {repository.latestReleaseTag} released on{' '}
                {new Date(Number(latestReleaseDate)).toLocaleDateString()}
              </strong>
            </Typography>
            <Typography variant="h6">Latest Release Notes</Typography>
            <Typography
              // Not ideal - use a library for this in production!
              dangerouslySetInnerHTML={{
                __html:
                  repository.latestReleaseNotes ||
                  'Release notes not available',
              }}
            />
          </>
        ) : (
          <Typography>No releases available for this repository.</Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default RepositoryDetails;
