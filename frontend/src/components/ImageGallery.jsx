import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalImages, setTotalImages] = useState(0);

  const perPage = 20;

  const fetchImages = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(!append);
      const response = await axios.get(
        `http://localhost:8000/api/list_images?page=${pageNum}&per_page=${perPage}`
      );

      const newImages = response.data.images;
      setTotalImages(response.data.total);

      if (append) {
        setImages((prev) => [...prev, ...newImages]);
      } else {
        setImages(newImages);
      }

      setHasMore(pageNum < response.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(1, false);
  }, [fetchImages]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchImages(page + 1, true);
    }
  };

  const refreshGallery = () => {
    setPage(1);
    setHasMore(true);
    fetchImages(1, false);
  };

  if (loading && images.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading images...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading images
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
        <Button variant="outlined" onClick={refreshGallery} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Paper>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Image Gallery ({totalImages} images)
          </Typography>
          <Button variant="outlined" size="small" onClick={refreshGallery}>
            Refresh
          </Button>
        </Box>

        {images.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            No images uploaded yet. Upload some images to get started!
          </Typography>
        ) : (
          <InfiniteScroll
            dataLength={images.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <Box sx={{ textAlign: "center", py: 2 }}>
                <CircularProgress size={30} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Loading more images...
                </Typography>
              </Box>
            }
            endMessage={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                You've seen all images!
              </Typography>
            }
          >
            <Grid container spacing={2}>
              {images.map((image, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={`${image.image_path}-${index}`}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={`http://localhost:8000/images/${image.image_path}`}
                      alt={image.caption}
                      sx={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.png";
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {new Date(
                          image.upload_time * 1000
                        ).toLocaleDateString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {image.caption}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Paper>
    </Container>
  );
};

export default ImageGallery;
