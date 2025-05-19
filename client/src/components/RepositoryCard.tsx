import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material';
import FiberNewIcon from '@mui/icons-material/FiberNew';

import type { Repository } from '../helpers/graphql';

type RepositoryCardProps = {
  repository: Repository;
  isSelected: boolean;
  onSetLatestReleaseSeen: () => void;
};

function RepositoryCard({
  repository,
  isSelected,
  onSetLatestReleaseSeen,
}: RepositoryCardProps) {
  const hasNewRelease = Boolean(
    repository.latestReleaseTag && !repository.seenAt
  );

  const getBorder = (theme: Theme) =>
    repository.latestReleaseTag && !repository.seenAt
      ? `4px solid ${theme.palette.success.main}`
      : 'none';

  return (
    <Card
      sx={{
        border: (theme) =>
          isSelected
            ? `4px solid ${theme.palette.secondary.main}`
            : getBorder(theme),
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography color="text.secondary" mb={1}>
            {repository.owner}
          </Typography>
          {repository.latestReleaseTag && !repository.seenAt && (
            <FiberNewIcon color="success" />
          )}
        </Box>
        <Stack spacing={2}>
          <Typography variant="h5" component="div">
            {repository.name}
          </Typography>
          <Typography variant="body2">
            {repository.description
              ? repository.description
              : 'No description available'}
          </Typography>
          <Typography>
            {repository.latestReleaseTag ? (
              <Typography variant="body2" color="text.secondary">
                <strong>
                  Latest release is {repository.latestReleaseTag} on{' '}
                  {new Date(
                    Number(repository.latestReleaseDate)
                  ).toLocaleDateString()}
                </strong>
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No releases available
              </Typography>
            )}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions>
        {hasNewRelease && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={onSetLatestReleaseSeen}
          >
            Mark as seen
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default RepositoryCard;
