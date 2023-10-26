-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-10-2023 a las 21:32:49
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pruebaamericana`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `nombre_rol` varchar(500) NOT NULL,
  `fecha_registra` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `nombre_rol`, `fecha_registra`, `estado`) VALUES
(1, 'Admin', '2023-10-26 12:40:04', 1),
(2, 'usuario', '2023-10-26 14:05:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documento`
--

CREATE TABLE `tipo_documento` (
  `id` int(11) NOT NULL,
  `nombre_documento` varchar(500) NOT NULL,
  `fecha_registra` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_documento`
--

INSERT INTO `tipo_documento` (`id`, `nombre_documento`, `fecha_registra`, `estado`) VALUES
(2, 'CC', '2023-10-26 12:33:16', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `numero_documento` int(11) NOT NULL,
  `nombre` varchar(500) NOT NULL,
  `apellido` varchar(500) NOT NULL,
  `correo` varchar(500) NOT NULL,
  `telefono` varchar(500) NOT NULL,
  `nick` varchar(500) NOT NULL,
  `image` varchar(500) NOT NULL DEFAULT 'default.png',
  `password` varchar(500) NOT NULL,
  `ultima_fecha_sesion` datetime NOT NULL DEFAULT current_timestamp(),
  `id_rol` int(11) NOT NULL DEFAULT 2,
  `id_tipo_documento` int(11) NOT NULL,
  `fecha_registra` datetime NOT NULL DEFAULT current_timestamp(),
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `numero_documento`, `nombre`, `apellido`, `correo`, `telefono`, `nick`, `image`, `password`, `ultima_fecha_sesion`, `id_rol`, `id_tipo_documento`, `fecha_registra`, `estado`) VALUES
(1, 1083559993, 'silfredo', 'orozco', 'silfredoantonio1991@hotmail.com', '3014402213', 'sorozco25', 'avatar-1698348405648-1083559993.jpg', '$2b$10$uVyug0mExmzD2yrwkh0HC.AAHWnNITl9eE4GBzqwOY7a9p0naIRYS', '2023-10-26 12:41:14', 1, 2, '2023-10-26 12:41:14', 1),
(3, 2147483647, 'wilian', 'enamorado', 'wilian@hotmail.com', '3026789097', 'wilian02', 'default.png', '$2b$10$uVyug0mExmzD2yrwkh0HC.AAHWnNITl9eE4GBzqwOY7a9p0naIRYS', '2023-10-26 14:21:55', 2, 2, '2023-10-26 14:21:55', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `usuario_ibfk_2` (`id_tipo_documento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_documento`
--
ALTER TABLE `tipo_documento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_tipo_documento`) REFERENCES `tipo_documento` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
