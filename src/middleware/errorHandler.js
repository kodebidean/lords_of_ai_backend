const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Errores específicos de la aplicación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.details
    });
  }

  // Errores de base de datos
  if (err.code === '23505') { // Violación de unicidad
    return res.status(409).json({
      success: false,
      error: 'El recurso ya existe'
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
};

module.exports = errorHandler; 