'use client'

import { useState, useEffect } from 'react'
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
import SaveIcon from '@mui/icons-material/Save'
import RestoreIcon from '@mui/icons-material/Restore'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme, DesignSystemConfig } from '@/lib/theme'
import { designSystemApi } from '@/lib/api'
import { useSnackbar } from '@/lib/snackbar'

export default function DesignSystemPage() {
  const muiTheme = useMuiTheme()
  const { config, setConfig } = useTheme()
  const { showSuccess, showError } = useSnackbar()
  const [editMode, setEditMode] = useState(false)
  const [localConfig, setLocalConfig] = useState<DesignSystemConfig>(config)

  // Update local config when global config changes (e.g. after fetch)
  useEffect(() => {
    if (!editMode) {
      setLocalConfig(config)
    }
  }, [config, editMode])

  const handleSave = async () => {
    try {
      const response = await designSystemApi.updateConfig(localConfig)
      setConfig(response.data)
      showSuccess('Configurações salvas com sucesso!')
      setEditMode(false)
    } catch (error) {
      showError('Erro ao salvar configurações')
    }
  }

  const handleReset = async () => {
    try {
      const response = await designSystemApi.resetToDefault()
      setConfig(response.data)
      setLocalConfig(response.data)
      showSuccess('Resetado para configurações padrão')
    } catch (error) {
      showError('Erro ao resetar configurações')
    }
  }

  const handleColorChange = (key: keyof DesignSystemConfig, value: string) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleNumberChange = (key: keyof DesignSystemConfig, value: number) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }))
  }

  const renderColorInput = (label: string, configKey: keyof DesignSystemConfig, value: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          bgcolor: value,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          cursor: editMode ? 'pointer' : 'default'
        }}
        onClick={() => {
          if (editMode) {
            const input = document.getElementById(`color-${configKey}`)
            if (input) input.click()
          }
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" fontWeight="bold" display="block">{label}</Typography>
        {editMode ? (
          <>
            <TextField
              size="small"
              value={value}
              onChange={(e) => handleColorChange(configKey, e.target.value)}
              fullWidth
              sx={{ mt: 0.5 }}
            />
            <input
              type="color"
              id={`color-${configKey}`}
              value={value}
              onChange={(e) => handleColorChange(configKey, e.target.value)}
              style={{ display: 'none' }}
            />
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">{value}</Typography>
        )}
      </Box>
    </Box>
  )

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Design System
          </Typography>
          <Typography color="text.secondary">
            Configure e visualize o sistema de design da aplicação
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {editMode ? (
            <>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CloseIcon />}
                onClick={() => {
                  setLocalConfig(config)
                  setEditMode(false)
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RestoreIcon />}
                onClick={handleReset}
              >
                Resetar Padrão
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Editar
              </Button>
            </>
          )}
        </Box>
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

          <Grid container spacing={4}>
            {/* Primary Colors */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                Primary (Verde)
              </Typography>
              {renderColorInput('Primary Light', 'primaryLight', localConfig.primaryLight)}
              {renderColorInput('Primary Main', 'primaryMain', localConfig.primaryMain)}
              {renderColorInput('Primary Dark', 'primaryDark', localConfig.primaryDark)}
            </Grid>

            {/* Secondary Colors */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                Secondary (Azul)
              </Typography>
              {renderColorInput('Secondary Light', 'secondaryLight', localConfig.secondaryLight)}
              {renderColorInput('Secondary Main', 'secondaryMain', localConfig.secondaryMain)}
              {renderColorInput('Secondary Dark', 'secondaryDark', localConfig.secondaryDark)}
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

          {editMode && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom>Font Family</Typography>
              <TextField
                fullWidth
                value={localConfig.fontFamily}
                onChange={(e) => handleColorChange('fontFamily', e.target.value)}
                helperText="Ex: Inter, Roboto, sans-serif"
              />
            </Box>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h1" sx={{ fontSize: localConfig.h1FontSize }}>H1 - Heading 1</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {localConfig.h1FontSize}px / 700
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="h2" sx={{ fontSize: localConfig.h2FontSize }}>H2 - Heading 2</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {localConfig.h2FontSize}px / 700
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="h3" sx={{ fontSize: localConfig.h3FontSize }}>H3 - Heading 3</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {localConfig.h3FontSize}px / 600
                  </Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="body1" sx={{ fontSize: localConfig.bodyFontSize }}>
                    Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {localConfig.bodyFontSize}px
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {editMode && (
              <Grid item xs={12} md={4}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">Tamanhos (px)</Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="H1 Size"
                      type="number"
                      size="small"
                      value={localConfig.h1FontSize}
                      onChange={(e) => handleNumberChange('h1FontSize', Number(e.target.value))}
                    />
                    <TextField
                      label="H2 Size"
                      type="number"
                      size="small"
                      value={localConfig.h2FontSize}
                      onChange={(e) => handleNumberChange('h2FontSize', Number(e.target.value))}
                    />
                    <TextField
                      label="H3 Size"
                      type="number"
                      size="small"
                      value={localConfig.h3FontSize}
                      onChange={(e) => handleNumberChange('h3FontSize', Number(e.target.value))}
                    />
                    <TextField
                      label="Body Size"
                      type="number"
                      size="small"
                      value={localConfig.bodyFontSize}
                      onChange={(e) => handleNumberChange('bodyFontSize', Number(e.target.value))}
                    />
                  </Stack>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>

      {/* Spacing & Shape */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SpaceBarIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Espaçamento
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Base Unit: {localConfig.spacingUnit}px
          </Typography>

          <Slider
            value={localConfig.spacingUnit}
            onChange={(_, value) => handleNumberChange('spacingUnit', value as number)}
            min={4}
            max={16}
            step={1}
            marks
            disabled={!editMode}
            valueLabelDisplay="auto"
            sx={{ mb: 3 }}
          />

          <Stack spacing={1}>
            {[1, 2, 4, 6].map((multiplier) => (
              <Box key={multiplier} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: localConfig.spacingUnit * multiplier,
                  height: 24,
                  bgcolor: 'primary.main',
                  borderRadius: localConfig.borderRadius / 4
                }} />
                <Typography variant="body2">
                  {multiplier}x = {localConfig.spacingUnit * multiplier}px
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <ViewModuleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Border Radius
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Valor atual: {localConfig.borderRadius}px
          </Typography>

          <Slider
            value={localConfig.borderRadius}
            onChange={(_, value) => handleNumberChange('borderRadius', value as number)}
            min={0}
            max={24}
            step={2}
            marks
            disabled={!editMode}
            valueLabelDisplay="auto"
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2}>
            {[1, 2].map((item) => (
              <Grid item xs={6} key={item}>
                <Box
                  sx={{
                    width: '100%',
                    height: 80,
                    bgcolor: 'primary.main',
                    borderRadius: `${localConfig.borderRadius}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: 2
                  }}
                >
                  Preview
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
            Preview de Componentes
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Veja como suas alterações afetam os componentes reais.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Button variant="contained">Primary Button</Button>
                <Button variant="outlined">Outlined Button</Button>
                <TextField label="Input Field" fullWidth size="small" />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Card Title</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Este card usa o border radius e as cores configuradas.
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip label="Chip 1" color="primary" />
                    <Chip label="Chip 2" color="secondary" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}
