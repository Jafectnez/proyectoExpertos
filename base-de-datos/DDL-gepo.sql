SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema gepo_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema gepo_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gepo_db` DEFAULT CHARACTER SET utf8 ;
USE `gepo_db` ;

-- -----------------------------------------------------
-- Table `gepo_db`.`TblTipoLugar`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblTipoLugar` (
  `idTipoLugar` INT NOT NULL,
  `tipoLugar` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idTipoLugar`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblLugares`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblLugares` (
  `idLugar` INT NOT NULL,
  `idLugarPadre` INT NULL,
  `idTipoLugar` INT NOT NULL,
  `nameLugar` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idLugar`),
  INDEX `fk_TblLugares_TblTipoLugar_idx` (`idTipoLugar` ASC) VISIBLE,
  INDEX `fk_TblLugares_TblLugares1_idx` (`idLugarPadre` ASC) VISIBLE,
  CONSTRAINT `fk_TblLugares_TblTipoLugar`
    FOREIGN KEY (`idTipoLugar`)
    REFERENCES `gepo_db`.`TblTipoLugar` (`idTipoLugar`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblLugares_TblLugares1`
    FOREIGN KEY (`idLugarPadre`)
    REFERENCES `gepo_db`.`TblLugares` (`idLugar`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblPersona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblPersona` (
  `idPersona` INT GENERATED ALWAYS AS () VIRTUAL COMMENT 'Identificador de la persona',
  `idLugarResidencia` INT NOT NULL COMMENT 'Guardara el id del lugar en que reside la persona.',
  `namePersona` VARCHAR(50) NOT NULL COMMENT 'almacenara el nombre de la persona',
  `lastNamePersona` VARCHAR(50) NOT NULL COMMENT 'Almacenara el apellido de la persona',
  `correoPersona` VARCHAR(50) NOT NULL COMMENT 'Almacenara el correo de la persona',
  PRIMARY KEY (`idPersona`),
  INDEX `fk_TblPersona_TblLugares1_idx` (`idLugarResidencia` ASC) VISIBLE,
  CONSTRAINT `fk_TblPersona_TblLugares1`
    FOREIGN KEY (`idLugarResidencia`)
    REFERENCES `gepo_db`.`TblLugares` (`idLugar`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblTipoUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblTipoUsuario` (
  `idTipoUsuario` INT NOT NULL,
  `tipoUsuario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoUsuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblUsuario` (
  `idUsuario` INT NOT NULL,
  `idPersona` INT NOT NULL COMMENT 'Identificador de la persona que creo el usuario',
  `idTipoUsuario` INT NOT NULL,
  `AliasUsuario` VARCHAR(50) NOT NULL,
  `contraseniaUsuario` VARCHAR(100) NOT NULL,
  `fotoPerfilUsuario` BLOB NULL,
  `biografiaUsuario` VARCHAR(400) NULL,
  `fechaRegistro` DATE NOT NULL,
  PRIMARY KEY (`idUsuario`),
  INDEX `fk_TblUsuario_TblPersona1_idx` (`idPersona` ASC) VISIBLE,
  INDEX `fk_TblUsuario_TblTipoUsuario1_idx` (`idTipoUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_TblUsuario_TblPersona1`
    FOREIGN KEY (`idPersona`)
    REFERENCES `gepo_db`.`TblPersona` (`idPersona`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblUsuario_TblTipoUsuario1`
    FOREIGN KEY (`idTipoUsuario`)
    REFERENCES `gepo_db`.`TblTipoUsuario` (`idTipoUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblPermisos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblPermisos` (
  `idPermisos` INT NOT NULL,
  `Permisos` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`idPermisos`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblEstadoSolicitud`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblEstadoSolicitud` (
  `idEstadoSolicitud` INT NOT NULL,
  `estadoSolicitud` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idEstadoSolicitud`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblTipoEspacioTrabajo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblTipoEspacioTrabajo` (
  `idTipoEspacioTrabajo` INT NOT NULL,
  `TipoEspacioTrabajo` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idTipoEspacioTrabajo`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblEspaciosTrabajo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblEspaciosTrabajo` (
  `idTblEspacioTrabajo` INT NOT NULL,
  `idUsuarioPadre` INT NOT NULL,
  `idTipoEspacioTrabajo` INT NOT NULL,
  `nombreEspacioTrabajo` VARCHAR(100) NULL,
  `fechaCreacion` DATE NOT NULL,
  PRIMARY KEY (`idTblEspacioTrabajo`),
  INDEX `fk_TblEspaciosTrabajo_TblUsuario1_idx` (`idUsuarioPadre` ASC) VISIBLE,
  INDEX `fk_TblEspaciosTrabajo_TblTipoEspacioTrabajo1_idx` (`idTipoEspacioTrabajo` ASC) VISIBLE,
  CONSTRAINT `fk_TblEspaciosTrabajo_TblUsuario1`
    FOREIGN KEY (`idUsuarioPadre`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblEspaciosTrabajo_TblTipoEspacioTrabajo1`
    FOREIGN KEY (`idTipoEspacioTrabajo`)
    REFERENCES `gepo_db`.`TblTipoEspacioTrabajo` (`idTipoEspacioTrabajo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblSolicitudesColaboracion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblSolicitudesColaboracion` (
  `idSolicitud` INT NOT NULL,
  `idEstadoSolicitud` INT NOT NULL,
  `idUsuarioEmisor` INT NOT NULL,
  `idUsuarioReceptor` INT NOT NULL,
  `idTblEspacioTrabajo` INT NOT NULL,
  `descripcionSolicitud` VARCHAR(200) NOT NULL,
  `fechaEmisionSolicitud` DATE NOT NULL,
  `fechaRespuesta` DATE NULL,
  PRIMARY KEY (`idSolicitud`),
  INDEX `fk_TblSolicitudesColaboracion_TblEstadoSolicitud1_idx` (`idEstadoSolicitud` ASC) VISIBLE,
  INDEX `fk_TblSolicitudesColaboracion_TblUsuario1_idx` (`idUsuarioReceptor` ASC) VISIBLE,
  INDEX `fk_TblSolicitudesColaboracion_TblUsuario2_idx` (`idUsuarioEmisor` ASC) VISIBLE,
  INDEX `fk_TblSolicitudesColaboracion_TblEspaciosTrabajo1_idx` (`idTblEspacioTrabajo` ASC) VISIBLE,
  CONSTRAINT `fk_TblSolicitudesColaboracion_TblEstadoSolicitud1`
    FOREIGN KEY (`idEstadoSolicitud`)
    REFERENCES `gepo_db`.`TblEstadoSolicitud` (`idEstadoSolicitud`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblSolicitudesColaboracion_TblUsuario1`
    FOREIGN KEY (`idUsuarioReceptor`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblSolicitudesColaboracion_TblUsuario2`
    FOREIGN KEY (`idUsuarioEmisor`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblSolicitudesColaboracion_TblEspaciosTrabajo1`
    FOREIGN KEY (`idTblEspacioTrabajo`)
    REFERENCES `gepo_db`.`TblEspaciosTrabajo` (`idTblEspacioTrabajo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblColaboradores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblColaboradores` (
  `idUsuario` INT NOT NULL,
  `idEspacioTrabajo` INT NOT NULL,
  `idPermisos` INT NOT NULL,
  `idSolicitud` INT NOT NULL,
  INDEX `fk_TblColaboradores_TblUsuario1_idx` (`idUsuario` ASC) VISIBLE,
  PRIMARY KEY (`idUsuario`, `idEspacioTrabajo`),
  INDEX `fk_TblColaboradores_TblPermisos1_idx` (`idPermisos` ASC) VISIBLE,
  INDEX `fk_TblColaboradores_TblSolicitudesColaboracion1_idx` (`idSolicitud` ASC) VISIBLE,
  INDEX `fk_TblColaboradores_TblEspaciosTrabajo1_idx` (`idEspacioTrabajo` ASC) VISIBLE,
  CONSTRAINT `fk_TblColaboradores_TblUsuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblColaboradores_TblPermisos1`
    FOREIGN KEY (`idPermisos`)
    REFERENCES `gepo_db`.`TblPermisos` (`idPermisos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblColaboradores_TblSolicitudesColaboracion1`
    FOREIGN KEY (`idSolicitud`)
    REFERENCES `gepo_db`.`TblSolicitudesColaboracion` (`idSolicitud`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblColaboradores_TblEspaciosTrabajo1`
    FOREIGN KEY (`idEspacioTrabajo`)
    REFERENCES `gepo_db`.`TblEspaciosTrabajo` (`idTblEspacioTrabajo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblModificaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblModificaciones` (
  `idModificacion` INT NOT NULL,
  `idUsuarioModificador` INT NOT NULL,
  `idlEspacioTrabajoModificado` INT NOT NULL,
  `fechaModificacion` DATE NOT NULL,
  `descripcionModificacion` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idModificacion`),
  INDEX `fk_TblModificaciones_TblUsuario1_idx` (`idUsuarioModificador` ASC) VISIBLE,
  INDEX `fk_TblModificaciones_TblEspaciosTrabajo1_idx` (`idlEspacioTrabajoModificado` ASC) VISIBLE,
  CONSTRAINT `fk_TblModificaciones_TblUsuario1`
    FOREIGN KEY (`idUsuarioModificador`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblModificaciones_TblEspaciosTrabajo1`
    FOREIGN KEY (`idlEspacioTrabajoModificado`)
    REFERENCES `gepo_db`.`TblEspaciosTrabajo` (`idTblEspacioTrabajo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblPreferencias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblPreferencias` (
  `idPreferencias` INT NOT NULL,
  `idUsuario` INT NOT NULL,
  `preferencias` JSON NOT NULL,
  PRIMARY KEY (`idPreferencias`),
  INDEX `fk_TblPreferencias_TblUsuario1_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_TblPreferencias_TblUsuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblEstadoNotificacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblEstadoNotificacion` (
  `idEstadoNotificacion` INT NOT NULL,
  `estadoNotificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idEstadoNotificacion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblTipoNotificacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblTipoNotificacion` (
  `idTipoNotificacion` INT NOT NULL,
  `tipoNotificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoNotificacion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblNotificaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblNotificaciones` (
  `idNotificacion` INT NOT NULL,
  `idUsuarioReceptor` INT NOT NULL,
  `idEstadoNotificacion` INT NOT NULL,
  `idTipoNotificacion` INT NOT NULL,
  `descripcionNotificacion` VARCHAR(100) NULL,
  `fechaNotificacion` DATE NOT NULL,
  PRIMARY KEY (`idNotificacion`),
  INDEX `fk_TblNotificaciones_TblUsuario1_idx` (`idUsuarioReceptor` ASC) VISIBLE,
  INDEX `fk_TblNotificaciones_TblEstadoNotificacion1_idx` (`idEstadoNotificacion` ASC) VISIBLE,
  INDEX `fk_TblNotificaciones_TblTipoNotificacion1_idx` (`idTipoNotificacion` ASC) VISIBLE,
  CONSTRAINT `fk_TblNotificaciones_TblUsuario1`
    FOREIGN KEY (`idUsuarioReceptor`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblNotificaciones_TblEstadoNotificacion1`
    FOREIGN KEY (`idEstadoNotificacion`)
    REFERENCES `gepo_db`.`TblEstadoNotificacion` (`idEstadoNotificacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblNotificaciones_TblTipoNotificacion1`
    FOREIGN KEY (`idTipoNotificacion`)
    REFERENCES `gepo_db`.`TblTipoNotificacion` (`idTipoNotificacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblPagos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblPagos` (
  `idPago` INT NOT NULL,
  `idUsuarioPagador` INT NOT NULL,
  `fechaPago` DATE NOT NULL,
  `descripcionPago` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idPago`),
  INDEX `fk_TblPagos_TblUsuario1_idx` (`idUsuarioPagador` ASC) VISIBLE,
  CONSTRAINT `fk_TblPagos_TblUsuario1`
    FOREIGN KEY (`idUsuarioPagador`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblInformacionTipoUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblInformacionTipoUsuario` (
  `idTipoUsuario` INT NOT NULL,
  `maxColaboradores` INT NOT NULL,
  `maxEspaciosTrabajo` INT NOT NULL,
  `maxProyectos` INT NOT NULL,
  INDEX `fk_TblInformacionTipoUsuario_TblTipoUsuario1_idx` (`idTipoUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_TblInformacionTipoUsuario_TblTipoUsuario1`
    FOREIGN KEY (`idTipoUsuario`)
    REFERENCES `gepo_db`.`TblTipoUsuario` (`idTipoUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblCarpetas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblCarpetas` (
  `idCarpeta` INT NOT NULL,
  `idEspacioTrabajo` INT NOT NULL,
  `idUsuarioCreador` INT NOT NULL,
  `idCarpetaPadre` INT NULL,
  `nombreCarpeta` VARCHAR(50) NOT NULL,
  `fechaCreacion` DATE NOT NULL,
  PRIMARY KEY (`idCarpeta`),
  INDEX `fk_TblCarpetas_TblUsuario1_idx` (`idUsuarioCreador` ASC) VISIBLE,
  INDEX `fk_TblCarpetas_TblCarpetas1_idx` (`idCarpetaPadre` ASC) VISIBLE,
  INDEX `fk_TblCarpetas_TblEspaciosTrabajo1_idx` (`idEspacioTrabajo` ASC) VISIBLE,
  CONSTRAINT `fk_TblCarpetas_TblUsuario1`
    FOREIGN KEY (`idUsuarioCreador`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblCarpetas_TblCarpetas1`
    FOREIGN KEY (`idCarpetaPadre`)
    REFERENCES `gepo_db`.`TblCarpetas` (`idCarpeta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblCarpetas_TblEspaciosTrabajo1`
    FOREIGN KEY (`idEspacioTrabajo`)
    REFERENCES `gepo_db`.`TblEspaciosTrabajo` (`idTblEspacioTrabajo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblProyectos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblProyectos` (
  `idProyecto` INT NOT NULL,
  `idCarpetaContenedora` INT NOT NULL,
  `idUsuarioCreador` INT NOT NULL,
  `nombreProyecto` VARCHAR(50) NOT NULL,
  `descripcionProyecto` VARCHAR(150) NULL,
  `fotoProyecto` BLOB NULL,
  `fechaCreacion` DATE NOT NULL,
  PRIMARY KEY (`idProyecto`),
  INDEX `fk_TblProyectos_TblCarpetas1_idx` (`idCarpetaContenedora` ASC) VISIBLE,
  INDEX `fk_TblProyectos_TblUsuario1_idx` (`idUsuarioCreador` ASC) VISIBLE,
  CONSTRAINT `fk_TblProyectos_TblCarpetas1`
    FOREIGN KEY (`idCarpetaContenedora`)
    REFERENCES `gepo_db`.`TblCarpetas` (`idCarpeta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblProyectos_TblUsuario1`
    FOREIGN KEY (`idUsuarioCreador`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblExtensiones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblExtensiones` (
  `idExtension` INT NOT NULL,
  `Extension` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`idExtension`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `gepo_db`.`TblArchivos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gepo_db`.`TblArchivos` (
  `idArchivo` INT NOT NULL,
  `idProyectoContenedor` INT NOT NULL,
  `idUsuarioCreador` INT NOT NULL,
  `idExtensionArchivo` INT NOT NULL,
  `nombreArchivo` VARCHAR(50) NOT NULL,
  `datoArchivo` MEDIUMTEXT NOT NULL,
  `fechaCreacion` DATE NOT NULL,
  PRIMARY KEY (`idArchivo`),
  INDEX `fk_TblArchivos_TblProyectos1_idx` (`idProyectoContenedor` ASC) VISIBLE,
  INDEX `fk_TblArchivos_TblUsuario1_idx` (`idUsuarioCreador` ASC) VISIBLE,
  INDEX `fk_TblArchivos_TblExtensiones1_idx` (`idExtensionArchivo` ASC) VISIBLE,
  CONSTRAINT `fk_TblArchivos_TblProyectos1`
    FOREIGN KEY (`idProyectoContenedor`)
    REFERENCES `gepo_db`.`TblProyectos` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblArchivos_TblUsuario1`
    FOREIGN KEY (`idUsuarioCreador`)
    REFERENCES `gepo_db`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblArchivos_TblExtensiones1`
    FOREIGN KEY (`idExtensionArchivo`)
    REFERENCES `gepo_db`.`TblExtensiones` (`idExtension`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
