import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CircularProgress,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useUnsplashImages } from '../../hooks/useUnsplashImages';
import { UnsplashImage } from '../../types';
import styles from './UnsplashDialog.module.scss';

interface UnsplashDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectImage: (image: UnsplashImage) => void;
  initialQuery?: string;
}

export const UnsplashDialog: React.FC<UnsplashDialogProps> = ({
  open,
  onClose,
  onSelectImage,
  initialQuery = 'nature',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const {
    images,
    loading,
    error,
    hasMore,
    searchImages,
    loadMore,
    reset,
  } = useUnsplashImages();

  useEffect(() => {
    if (open) {
      searchImages(initialQuery);
    } else {
      reset();
    }
  }, [open, initialQuery, searchImages, reset]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchImages(searchQuery.trim());
    }
  };

  const handleImageSelect = (image: UnsplashImage) => {
    onSelectImage(image);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      className={styles.dialog}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Select Image from Unsplash</Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images..."
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end">
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {loading && images.length === 0 ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {images.map((image) => (
                <Grid item xs={6} sm={4} md={3} key={image.id}>
                  <Card className={styles.imageCard}>
                    <CardActionArea onClick={() => handleImageSelect(image)}>
                      <CardMedia
                        component="img"
                        image={image.urls.small}
                        alt={image.alt_description || 'Unsplash image'}
                        className={styles.image}
                      />
                      <Box className={styles.imageOverlay}>
                        <Typography variant="caption" className={styles.photographer}>
                          {image.user.name}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {images.length === 0 && !loading && (
              <Box py={4} textAlign="center">
                <Typography color="text.secondary">
                  No images found. Try a different search term.
                </Typography>
              </Box>
            )}

            {hasMore && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outlined"
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
