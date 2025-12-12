'use client'

import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Alert from '@mui/material/Alert'
import { useTheme as useMuiTheme } from '@mui/material/styles'
import PaletteIcon from '@mui/icons-material/Palette'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import SpaceBarIcon from '@mui/icons-material/SpaceBar'
import ViewModuleIcon from '@mui/icons-material/ViewModule'

export default function DesignSystemPage() {
  const theme = useMuiTheme()
  const [borderRadius, setBorderRadius] = useState(8)
  const [spacing, setSpacing] = useState(8)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Design System
        </Typography>
        <Typography color="text.secondary">
          Configure e visualize o sistema de design da aplicação
        </Typography>
      </Grid>

      {/* Color Palette */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PaletteIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Paleta de Cores
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {/* Primary Colors */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Primary (Verde)
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'primary.light', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Light</Typography>
                    <Typography variant="caption" color="text.secondary">{theme.palette.primary.light}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'primary.main', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Main</Typography>
                    <Typography variant="caption" color="text.secondary">{theme.palette.primary.main}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'primary.dark', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Dark</Typography>
                    <Typography variant="caption" color="text.secondary">{theme.palette.primary.dark}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Secondary Colors */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Secondary (Azul)
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'secondary.light', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Light</Typography>
                    <Typography variant="caption" color="text.secondary">{theme.palette.secondary.light}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'secondary.main', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Main</Typography>
                    <Typography variant="caption" color="text.secondary">{theme.palette.secondary.main}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'secondary.dark', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">Dark</Typography>
                    <Typography variant="caption" color="text.secondary">{theme.palette.secondary.dark}</Typography>
                  </Box>
                </Box>
              </Stack>
            </Grid>

            {/* Semantic Colors */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                Cores Semânticas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: 'success.main', borderRadius: 1 }} />
                    <Box>
                      <Typography variant="caption" fontWeight="bold">Success</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {theme.palette.success.main}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: 'error.main', borderRadius: 1 }} />
                    <Box>
                      <Typography variant="caption" fontWeight="bold">Error</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {theme.palette.error.main}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: 'warning.main', borderRadius: 1 }} />
                    <Box>
                      <Typography variant="caption" fontWeight="bold">Warning</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {theme.palette.warning.main}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: 'info.main', borderRadius: 1 }} />
                    <Box>
                      <Typography variant="caption" fontWeight="bold">Info</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {theme.palette.info.main}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* Background Colors */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                Backgrounds
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                    <Box>
                      <Typography variant="caption" fontWeight="bold">Default</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {theme.palette.background.default}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }} />
                    <Box>
                      <Typography variant="caption" fontWeight="bold">Paper</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {theme.palette.background.paper}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Typography */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TextFieldsIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Tipografia
            </Typography>
          </Box>

          <Stack spacing={2}>
            <Box>
              <Typography variant="h1">H1 - Heading 1</Typography>
              <Typography variant="caption" color="text.secondary">
                {theme.typography.h1.fontSize} / {theme.typography.h1.fontWeight}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="h2">H2 - Heading 2</Typography>
              <Typography variant="caption" color="text.secondary">
                {theme.typography.h2.fontSize} / {theme.typography.h2.fontWeight}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="h3">H3 - Heading 3</Typography>
              <Typography variant="caption" color="text.secondary">
                {theme.typography.h3.fontSize} / {theme.typography.h3.fontWeight}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="h4">H4 - Heading 4</Typography>
              <Typography variant="caption" color="text.secondary">
                {theme.typography.h4.fontSize} / {theme.typography.h4.fontWeight}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="h5">H5 - Heading 5</Typography>
              <Typography variant="caption" color="text.secondary">
                {theme.typography.h5.fontSize} / {theme.typography.h5.fontWeight}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="h6">H6 - Heading 6</Typography>
              <Typography variant="caption" color="text.secondary">
                {theme.typography.h6.fontSize} / {theme.typography.h6.fontWeight}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="body1">Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
              <Typography variant="caption" color="text.secondary">
                {theme.typography.body1.fontSize}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="body2">Body 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
              <Typography variant="caption" color="text.secondary">
                {theme.typography.body2.fontSize}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="caption">Caption - Small text for captions and labels</Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>

      {/* Spacing */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SpaceBarIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Espaçamento
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Base Unit: {spacing}px
          </Typography>
          <Slider
            value={spacing}
            onChange={(_, value) => setSpacing(value as number)}
            min={4}
            max={16}
            step={2}
            marks
            valueLabelDisplay="auto"
            sx={{ mb: 3 }}
          />

          <Stack spacing={1}>
            {[1, 2, 3, 4, 6, 8].map((multiplier) => (
              <Box key={multiplier} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: spacing * multiplier, height: 24, bgcolor: 'primary.main', borderRadius: 0.5 }} />
                <Typography variant="body2">
                  {multiplier} × {spacing}px = {spacing * multiplier}px
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {/* Border Radius */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ViewModuleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Border Radius
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Valor atual: {borderRadius}px
          </Typography>
          <Slider
            value={borderRadius}
            onChange={(_, value) => setBorderRadius(value as number)}
            min={0}
            max={24}
            step={2}
            marks
            valueLabelDisplay="auto"
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2}>
            {[0, 4, 8, 12, 16, 24].map((radius) => (
              <Grid item xs={4} key={radius}>
                <Box
                  sx={{
                    width: '100%',
                    height: 80,
                    bgcolor: 'primary.main',
                    borderRadius: `${radius}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  {radius}px
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* Components Preview */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Componentes
          </Typography>

          <Grid container spacing={3}>
            {/* Buttons */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Buttons
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
                <Button variant="contained" disabled>Disabled</Button>
              </Stack>
            </Grid>

            {/* Chips */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Chips
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label="Default" />
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Success" color="success" />
                <Chip label="Error" color="error" />
              </Stack>
            </Grid>

            {/* Alerts */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Alerts
              </Typography>
              <Stack spacing={2}>
                <Alert severity="success">Success alert - operation completed successfully!</Alert>
                <Alert severity="info">Info alert - here's some information for you.</Alert>
                <Alert severity="warning">Warning alert - please be careful!</Alert>
                <Alert severity="error">Error alert - something went wrong.</Alert>
              </Stack>
            </Grid>

            {/* Cards */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Cards
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Card Title
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This is a sample card component with some content inside.
                  </Typography>
                  <Button variant="contained" sx={{ mt: 2 }}>
                    Action
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Form Controls */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Form Controls
              </Typography>
              <Stack spacing={2}>
                <TextField label="Text Field" variant="outlined" fullWidth />
                <FormControlLabel control={<Switch defaultChecked />} label="Switch" />
                <FormControlLabel control={<Switch />} label="Switch Off" />
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Theme Info */}
      <Grid item xs={12}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Modo atual:</strong> {theme.palette.mode === 'dark' ? 'Escuro' : 'Claro'}
          </Typography>
          <Typography variant="body2">
            <strong>Font Family:</strong> {theme.typography.fontFamily}
          </Typography>
          <Typography variant="body2">
            <strong>Border Radius padrão:</strong> {theme.shape.borderRadius}px
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  )
}
