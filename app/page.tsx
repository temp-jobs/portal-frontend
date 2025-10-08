'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Button,
  Paper,
  InputBase,
  Divider,
  Menu,
  MenuItem,
  Container,
  Grid,
  Avatar,
  Stack,
  Chip,
  Card,
  CardContent,
  CardActions,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
  useTheme,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarBorder from '@mui/icons-material/StarBorder';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

/**
 * app/page.tsx
 * Upwork-inspired interactive landing page for "Part Time Match"
 * - Uses MUI + Framer Motion
 * - Client component to avoid SSR hydration mismatches
 * - Copy & paste into /app/page.tsx
 *
 * NOTE: This is an original implementation inspired by Upwork's UX. Do not copy trademarked assets.
 */

const CATEGORIES = [
  'Customer Support',
  'Remote Admin',
  'Tutoring & Teaching',
  'Delivery & Local Gigs',
  'Retail & Hospitality',
  'Care & Wellness',
];

const FEATURE_ITEMS = [
  {
    title: 'Smart Matching',
    subtitle: 'Matches based on availability and skills.',
    icon: <SearchIcon />,
  },
  {
    title: 'Vetted Employers',
    subtitle: 'Reliable part-time roles from trusted employers.',
    icon: <PeopleOutlineIcon />,
  },
  {
    title: 'Flexible Shifts',
    subtitle: 'Morning, evening, weekend — work your way.',
    icon: <CalendarTodayIcon />,
  },
];

const SAMPLE_JOBS = [
  {
    id: '1',
    title: 'Part-Time Customer Support Rep',
    company: 'BrightHelp',
    location: 'Remote (US)',
    hours: '15–25 hrs/week',
    pay: '$18–22/hr',
    tags: ['Remote', 'Evenings'],
  },
  {
    id: '2',
    title: 'Virtual Assistant — Flexible Hours',
    company: 'GreenDesk',
    location: 'Remote',
    hours: '10–20 hrs/week',
    pay: '$16–20/hr',
    tags: ['Remote', 'Admin'],
  },
  {
    id: '3',
    title: 'After-School Math Tutor',
    company: 'TutorPlus',
    location: 'Local — NYC',
    hours: '6–10 hrs/week',
    pay: '$25/hr',
    tags: ['Local', 'Evenings'],
  },
];

export default function Page() {
  const router = useRouter();
  const theme = useTheme();

  // header state
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [findAnchor, setFindAnchor] = React.useState<null | HTMLElement>(null);
  const [hireAnchor, setHireAnchor] = React.useState<null | HTMLElement>(null);
  const [resourcesAnchor, setResourcesAnchor] = React.useState<null | HTMLElement>(null);
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null);

  // small UI toggles
  const [showSavedOnly, setShowSavedOnly] = React.useState(false);

  // animation variants
  const containerFade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } };
  const cardRise = { hidden: { y: 12, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.5 } } };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const q = fd.get('q')?.toString().trim();
    const loc = fd.get('location')?.toString().trim();
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    if (loc) params.set('location', loc);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <>
      <CssBaseline />

      {/* HEADER */}
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          backdropFilter: 'saturate(140%) blur(6px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 6 }, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>

            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
              onClick={() => router.push('/')}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WorkOutlineIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" fontWeight={800}>
                Part Time Match
              </Typography>
            </Box>

            {/* Desktop nav */}
            <Stack direction="row" spacing={0} sx={{ ml: 2, display: { xs: 'none', md: 'flex' } }}>
              <Button
                size="small"
                onMouseEnter={(e) => setFindAnchor(e.currentTarget as HTMLElement)}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Find Work
              </Button>
              <Button
                size="small"
                onMouseEnter={(e) => setHireAnchor(e.currentTarget as HTMLElement)}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Hire Talent
              </Button>
              <Button
                size="small"
                onMouseEnter={(e) => setResourcesAnchor(e.currentTarget as HTMLElement)}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Resources
              </Button>
            </Stack>
          </Box>

          {/* Center search (desktop) */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Paper
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '80%',
                maxWidth: 1000,
                p: '6px 12px',
                borderRadius: 6,
                boxShadow: '0 6px 20px rgba(13,38,63,0.06)',
              }}
            >
              <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <InputBase name="q" placeholder="Search part-time jobs, e.g. 'customer support'" sx={{ flex: 1 }} />
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <InputBase name="location" placeholder="City or remote" sx={{ width: 200 }} />
              <Button type="submit" variant="contained" sx={{ ml: 2, borderRadius: 3 }}>
                Search
              </Button>
            </Paper>
          </Box>

          {/* Right actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ display: { xs: 'none', md: 'inline-flex' } }} onClick={() => router.push('/post')}>
              <PeopleOutlineIcon />
            </IconButton>

            <IconButton onClick={() => router.push('/notifications')}>
              <NotificationsNoneIcon />
            </IconButton>

            <Button size="small" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button variant="contained" size="small" onClick={() => router.push('/register')}>
              Sign up
            </Button>

            <IconButton sx={{ ml: 1 }} onClick={(e) => setProfileAnchor(e.currentTarget as HTMLElement)}>
              <Avatar sx={{ width: 34, height: 34 }}>PM</Avatar>
            </IconButton>
          </Box>
        </Toolbar>

        {/* Dropdown menus */}
        <Menu
          anchorEl={findAnchor}
          open={Boolean(findAnchor)}
          onClose={() => setFindAnchor(null)}
          MenuListProps={{ onMouseLeave: () => setFindAnchor(null) }}
        >
          <MenuItem onClick={() => { setFindAnchor(null); router.push('/jobs'); }}>Browse jobs</MenuItem>
          <MenuItem onClick={() => { setFindAnchor(null); router.push('/saved'); }}>Saved jobs</MenuItem>
          <MenuItem onClick={() => { setFindAnchor(null); router.push('/applications'); }}>My applications</MenuItem>
        </Menu>

        <Menu
          anchorEl={hireAnchor}
          open={Boolean(hireAnchor)}
          onClose={() => setHireAnchor(null)}
          MenuListProps={{ onMouseLeave: () => setHireAnchor(null) }}
        >
          <MenuItem onClick={() => { setHireAnchor(null); router.push('/post'); }}>Post a job</MenuItem>
          <MenuItem onClick={() => { setHireAnchor(null); router.push('/talent'); }}>Browse talent</MenuItem>
          <MenuItem onClick={() => { setHireAnchor(null); router.push('/pricing'); }}>Pricing</MenuItem>
        </Menu>

        <Menu
          anchorEl={resourcesAnchor}
          open={Boolean(resourcesAnchor)}
          onClose={() => setResourcesAnchor(null)}
          MenuListProps={{ onMouseLeave: () => setResourcesAnchor(null) }}
        >
          <MenuItem onClick={() => { setResourcesAnchor(null); router.push('/blog'); }}>Blog</MenuItem>
          <MenuItem onClick={() => { setResourcesAnchor(null); router.push('/help'); }}>Help center</MenuItem>
          <MenuItem onClick={() => { setResourcesAnchor(null); router.push('/community'); }}>Community</MenuItem>
        </Menu>

        <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={() => setProfileAnchor(null)}>
          <MenuItem onClick={() => { setProfileAnchor(null); router.push('/profile'); }}>Profile</MenuItem>
          <MenuItem onClick={() => { setProfileAnchor(null); router.push('/settings'); }}>Settings</MenuItem>
          <MenuItem onClick={() => { setProfileAnchor(null); router.push('/logout'); }}>Sign out</MenuItem>
        </Menu>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 300 }} role="presentation" onClick={() => setMobileOpen(false)}>
          <List>
            <ListItem>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>PM</Avatar>
                <Box>
                  <Typography fontWeight={800}>Part Time Match</Typography>
                  <Typography variant="body2" color="text.secondary">Find part-time work</Typography>
                </Box>
              </Box>
            </ListItem>
            <Divider />
            <ListItemButton onClick={() => router.push('/jobs')}>
              <ListItemText primary="Find Work" />
            </ListItemButton>
            <ListItemButton onClick={() => router.push('/post')}>
              <ListItemText primary="Post a job" />
            </ListItemButton>
            <ListItemButton onClick={() => router.push('/categories')}>
              <ListItemText primary="Categories" />
            </ListItemButton>
            <ListItemButton onClick={() => router.push('/help')}>
              <ListItemText primary="Help" />
            </ListItemButton>
            <Divider />
            <ListItemButton onClick={() => router.push('/login')}>
              <ListItemText primary="Login" />
            </ListItemButton>
            <ListItemButton onClick={() => router.push('/register')}>
              <ListItemText primary="Sign up" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* HERO */}
      <Box component="main" sx={{ bgcolor: 'background.default', pb: { xs: 8, md: 12 } }}>
        <Box
          sx={{
            width: '100%',
            background: `linear-gradient(180deg, rgba(66,165,245,0.08), transparent 50%)`,
            pt: { xs: 6, md: 10 },
            pb: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth={false} sx={{ maxWidth: 1400, px: { xs: 2, md: 6 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h3" fontWeight={900} sx={{ mb: 2 }}>
                    Flexible part-time work that fits your life
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 720 }}>
                    Find vetted, reliable part-time roles — remote or local. Morning, evening, or weekend shifts.
                  </Typography>
                </motion.div>

                <motion.div initial="hidden" animate="show" variants={containerFade}>
                  <Paper
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: '10px',
                      borderRadius: 6,
                      boxShadow: '0 10px 30px rgba(13,38,63,0.06)',
                      maxWidth: 1000,
                    }}
                  >
                    <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />
                    <InputBase name="q" placeholder="Search roles, e.g. 'customer support'" sx={{ flex: 1 }} />
                    <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                    <LocationOnIcon sx={{ color: 'text.secondary' }} />
                    <InputBase name="location" placeholder="City or remote" sx={{ width: 220 }} />
                    <Button type="submit" variant="contained" sx={{ ml: 2, borderRadius: 3 }}>
                      Search
                    </Button>
                  </Paper>
                </motion.div>

                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button variant="outlined" onClick={() => router.push('/jobs')}>Find Work</Button>
                  <Button variant="contained" onClick={() => router.push('/post')}>Hire Talent</Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>Saved only</Typography>
                    <Switch checked={showSavedOnly} onChange={() => setShowSavedOnly((s) => !s)} />
                  </Box>
                </Stack>

                <Box sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {['Evenings', 'Weekends', 'Remote'].map((t) => (
                      <Chip key={t} label={t} variant="outlined" sx={{ borderRadius: 2 }} onClick={() => router.push(`/jobs?shift=${t.toLowerCase()}`)} />
                    ))}
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(76,175,80,0.06)' }}>
                    <Typography fontWeight={800} sx={{ mb: 1 }}>
                      Recommended for you
                    </Typography>
                    <Stack spacing={1.5}>
                      {SAMPLE_JOBS.map((job) => (
                        <motion.div key={job.id} variants={cardRise}>
                          <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2 }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, mx: 1 }}>{job.company.charAt(0)}</Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography fontWeight={700}>{job.title}</Typography>
                              <Typography variant="body2" color="text.secondary">{job.company} · {job.location}</Typography>
                            </Box>
                            <Button size="small" onClick={() => router.push(`/jobs/${job.id}`)} endIcon={<ArrowForwardIosIcon fontSize="small" />}>View</Button>
                          </Card>
                        </motion.div>
                      ))}
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* FEATURES */}
        <Container maxWidth={false} sx={{ maxWidth: 1400, px: { xs: 2, md: 6 }, mt: 6 }}>
          <Grid container spacing={3}>
            {FEATURE_ITEMS.map((f) => (
              <Grid item xs={12} md={4} key={f.title}>
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Card sx={{ p: 2, borderRadius: 3, boxShadow: '0 6px 18px rgba(13,38,63,0.04)' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'rgba(21,101,192,0.08)', color: theme.palette.primary.main }}>{f.icon}</Avatar>
                      <Box>
                        <Typography fontWeight={800}>{f.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{f.subtitle}</Typography>
                      </Box>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CATEGORIES */}
        <Box sx={{ mt: 8 }}>
          <Container maxWidth={false} sx={{ maxWidth: 1400, px: { xs: 2, md: 6 } }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>Browse categories</Typography>
            <Grid container spacing={3}>
              {CATEGORIES.map((c, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={c}>
                  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
                    <Card
                      onClick={() => router.push(`/jobs?category=${encodeURIComponent(c)}`)}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(13,38,63,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{c.charAt(0)}</Avatar>
                      <Box>
                        <Typography fontWeight={800}>{c}</Typography>
                        <Typography variant="body2" color="text.secondary">Flexible shifts · Vetted</Typography>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* FEATURED JOBS */}
        <Box sx={{ mt: 8, pb: 10 }}>
          <Container maxWidth={false} sx={{ maxWidth: 1400, px: { xs: 2, md: 6 } }}>
            <Typography variant="h5" fontWeight={900} sx={{ mb: 3 }}>Featured part-time roles</Typography>
            <Grid container spacing={3}>
              {SAMPLE_JOBS.map((job) => (
                <Grid item xs={12} md={4} key={job.id}>
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.18 }}>
                    <Card sx={{ borderRadius: 3, p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(13,38,63,0.04)' }}>
                      <Box>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{job.company.charAt(0)}</Avatar>
                          <Box>
                            <Typography fontWeight={800}>{job.title}</Typography>
                            <Typography variant="body2" color="text.secondary">{job.company} · {job.location}</Typography>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                          <Chip label={job.hours} size="small" />
                          <Chip label={job.pay} size="small" />
                          {job.tags.map((t) => <Chip key={t} label={t} size="small" />)}
                        </Stack>
                      </Box>

                      <CardActions sx={{ mt: 2, px: 0 }}>
                        <Button size="small" onClick={() => router.push(`/jobs/${job.id}`)}>View details</Button>
                        <Button variant="contained" sx={{ ml: 'auto' }} onClick={() => router.push(`/apply?job=${job.id}`)}>Apply</Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* FOOTER */}
        <Box component="footer" sx={{ bgcolor: '#0b3d91', color: 'white', pt: 8, pb: 6 }}>
          <Container maxWidth={false} sx={{ maxWidth: 1400, px: { xs: 2, md: 6 } }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight={900}>Part Time Match</Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
                  Connecting people with reliable part-time work — fast, fair, flexible.
                </Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography fontWeight={800}>For workers</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Button variant="text" size="small" sx={{ color: 'rgba(255,255,255,0.9)', justifyContent: 'flex-start' }} onClick={() => router.push('/register')}>Get Hired</Button>
                  <Button variant="text" size="small" sx={{ color: 'rgba(255,255,255,0.9)', justifyContent: 'flex-start' }} onClick={() => router.push('/jobs')}>Find jobs</Button>
                </Stack>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography fontWeight={800}>For employers</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Button variant="text" size="small" sx={{ color: 'rgba(255,255,255,0.9)', justifyContent: 'flex-start' }} onClick={() => router.push('/post')}>Post a job</Button>
                  <Button variant="text" size="small" sx={{ color: 'rgba(255,255,255,0.9)', justifyContent: 'flex-start' }} onClick={() => router.push('/pricing')}>Pricing</Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography fontWeight={800}>Company</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Button variant="text" size="small" sx={{ color: 'rgba(255,255,255,0.9)', justifyContent: 'flex-start' }} onClick={() => router.push('/about')}>About</Button>
                  <Button variant="text" size="small" sx={{ color: 'rgba(255,255,255,0.9)', justifyContent: 'flex-start' }} onClick={() => router.push('/careers')}>Careers</Button>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.08)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2">© {new Date().getFullYear()} Part Time Match</Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="text" size="small" sx={{ color: 'rgba(255,255,255,0.9)' }} onClick={() => router.push('/terms')}>Terms</Button>
                <Button variant="text" size="small" sx={{ color: 'rgba(255,255,255,0.9)' }} onClick={() => router.push('/privacy')}>Privacy</Button>
              </Stack>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
