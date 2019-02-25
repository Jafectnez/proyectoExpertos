SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gepo-db` DEFAULT CHARACTER SET utf8 ;
USE `gepo-db` ;

-- -----------------------------------------------------
-- Table `mydb`.`TblTipoLugar`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblTipoLugar` (
  `idTipoLugar` INT NOT NULL,
  `tipoLugar` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idTipoLugar`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblLugares`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblLugares` (
  `idLugar` INT NOT NULL,
  `idLugarPadre` INT NULL,
  `idTipoLugar` INT NOT NULL,
  `nameLugar` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idLugar`),
  INDEX `fk_TblLugares_TblTipoLugar_idx` (`idTipoLugar` ASC) VISIBLE,
  INDEX `fk_TblLugares_TblLugares1_idx` (`idLugarPadre` ASC) VISIBLE,
  CONSTRAINT `fk_TblLugares_TblTipoLugar`
    FOREIGN KEY (`idTipoLugar`)
    REFERENCES `mydb`.`TblTipoLugar` (`idTipoLugar`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblLugares_TblLugares1`
    FOREIGN KEY (`idLugarPadre`)
    REFERENCES `mydb`.`TblLugares` (`idLugar`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblPersona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblPersona` (
  `idPersona` INT GENERATED ALWAYS AS () VIRTUAL COMMENT 'Identificador de la persona',
  `idLugarResidencia` INT NOT NULL COMMENT 'Guardara el id del lugar en que reside la persona.',
  `namePersona` VARCHAR(50) NOT NULL COMMENT 'almacenara el nombre de la persona',
  `lastNamePersona` VARCHAR(50) NOT NULL COMMENT 'Almacenara el apellido de la persona',
  `correoPersona` VARCHAR(50) NOT NULL COMMENT 'Almacenara el correo de la persona',
  PRIMARY KEY (`idPersona`),
  INDEX `fk_TblPersona_TblLugares1_idx` (`idLugarResidencia` ASC) VISIBLE,
  CONSTRAINT `fk_TblPersona_TblLugares1`
    FOREIGN KEY (`idLugarResidencia`)
    REFERENCES `mydb`.`TblLugares` (`idLugar`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblTipoUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblTipoUsuario` (
  `idTipoUsuario` INT NOT NULL,
  `tipoUsuario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoUsuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblUsuario` (
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
    REFERENCES `mydb`.`TblPersona` (`idPersona`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblUsuario_TblTipoUsuario1`
    FOREIGN KEY (`idTipoUsuario`)
    REFERENCES `mydb`.`TblTipoUsuario` (`idTipoUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblProyectos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblProyectos` (
  `idProyecto` INT NOT NULL,
  `idUsuarioCreador` INT NOT NULL,
  `nameProyecto` VARCHAR(100) NOT NULL,
  `fotoProyecto` BLOB NULL,
  `descripcionProyecto` VARCHAR(200) NULL,
  `fechaCreacion` DATE NOT NULL,
  PRIMARY KEY (`idProyecto`),
  INDEX `fk_TblProyectos_TblUsuario1_idx` (`idUsuarioCreador` ASC) VISIBLE,
  CONSTRAINT `fk_TblProyectos_TblUsuario1`
    FOREIGN KEY (`idUsuarioCreador`)
    REFERENCES `mydb`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblCarpetas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblCarpetas` (
  `idCarpeta` INT NOT NULL,
  `idCarpetaPadre` INT NULL,
  `idProyectoContenedor` INT NOT NULL,
  `nameCarpeta` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idCarpeta`),
  INDEX `fk_TblCarpetas_TblCarpetas1_idx` (`idCarpetaPadre` ASC) VISIBLE,
  INDEX `fk_TblCarpetas_TblProyectos1_idx` (`idProyectoContenedor` ASC) VISIBLE,
  CONSTRAINT `fk_TblCarpetas_TblCarpetas1`
    FOREIGN KEY (`idCarpetaPadre`)
    REFERENCES `mydb`.`TblCarpetas` (`idCarpeta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblCarpetas_TblProyectos1`
    FOREIGN KEY (`idProyectoContenedor`)
    REFERENCES `mydb`.`TblProyectos` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblArchivos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblArchivos` (
  `idArchivo` INT NOT NULL,
  `idCarpetaContenedora` INT NOT NULL,
  `nameArchivo` VARCHAR(45) NOT NULL,
  `datoArchivo` MEDIUMTEXT NOT NULL,
  `extensionArchivo` VARCHAR(5) NOT NULL,
  `fechaCreacion` DATE NOT NULL,
  PRIMARY KEY (`idArchivo`),
  INDEX `fk_TblArchivos_TblCarpetas1_idx` (`idCarpetaContenedora` ASC) VISIBLE,
  CONSTRAINT `fk_TblArchivos_TblCarpetas1`
    FOREIGN KEY (`idCarpetaContenedora`)
    REFERENCES `mydb`.`TblCarpetas` (`idCarpeta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblColaboradores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblColaboradores` (
  `idUsuario` INT NOT NULL,
  `idProyecto` INT NOT NULL,
  INDEX `fk_TblColaboradores_TblUsuario1_idx` (`idUsuario` ASC) VISIBLE,
  INDEX `fk_TblColaboradores_TblProyectos1_idx` (`idProyecto` ASC) VISIBLE,
  PRIMARY KEY (`idUsuario`, `idProyecto`),
  CONSTRAINT `fk_TblColaboradores_TblUsuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `mydb`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblColaboradores_TblProyectos1`
    FOREIGN KEY (`idProyecto`)
    REFERENCES `mydb`.`TblProyectos` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblModificaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblModificaciones` (
  `idModificacion` INT NOT NULL,
  `idUsuarioModificador` INT NOT NULL,
  `idProyectoModificado` INT NOT NULL,
  `fechaModificacion` DATE NOT NULL,
  `descripcionModificacion` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idModificacion`),
  INDEX `fk_TblModificaciones_TblUsuario1_idx` (`idUsuarioModificador` ASC) VISIBLE,
  INDEX `fk_TblModificaciones_TblProyectos1_idx` (`idProyectoModificado` ASC) VISIBLE,
  CONSTRAINT `fk_TblModificaciones_TblUsuario1`
    FOREIGN KEY (`idUsuarioModificador`)
    REFERENCES `mydb`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblModificaciones_TblProyectos1`
    FOREIGN KEY (`idProyectoModificado`)
    REFERENCES `mydb`.`TblProyectos` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblEstadoSolicitud`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblEstadoSolicitud` (
  `idEstadoSolicitud` INT NOT NULL,
  `estadoSolicitud` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idEstadoSolicitud`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblSolicitudesColaboracion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblSolicitudesColaboracion` (
  `idSolicitud` INT NOT NULL,
  `idEstadoSolicitud` INT NOT NULL,
  `idUsuarioEmisor` INT NOT NULL,
  `idUsuarioReceptor` INT NOT NULL,
  `idProyecto` INT NOT NULL,
  `descripcionSolicitud` VARCHAR(200) NOT NULL,
  `fecha` DATE NOT NULL,
  PRIMARY KEY (`idSolicitud`),
  INDEX `fk_TblSolicitudesColaboracion_TblEstadoSolicitud1_idx` (`idEstadoSolicitud` ASC) VISIBLE,
  INDEX `fk_TblSolicitudesColaboracion_TblProyectos1_idx` (`idProyecto` ASC) VISIBLE,
  INDEX `fk_TblSolicitudesColaboracion_TblUsuario1_idx` (`idUsuarioReceptor` ASC) VISIBLE,
  INDEX `fk_TblSolicitudesColaboracion_TblUsuario2_idx` (`idUsuarioEmisor` ASC) VISIBLE,
  CONSTRAINT `fk_TblSolicitudesColaboracion_TblEstadoSolicitud1`
    FOREIGN KEY (`idEstadoSolicitud`)
    REFERENCES `mydb`.`TblEstadoSolicitud` (`idEstadoSolicitud`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblSolicitudesColaboracion_TblProyectos1`
    FOREIGN KEY (`idProyecto`)
    REFERENCES `mydb`.`TblProyectos` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblSolicitudesColaboracion_TblUsuario1`
    FOREIGN KEY (`idUsuarioReceptor`)
    REFERENCES `mydb`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblSolicitudesColaboracion_TblUsuario2`
    FOREIGN KEY (`idUsuarioEmisor`)
    REFERENCES `mydb`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblPreferencias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblPreferencias` (
  `idPreferencias` INT NOT NULL,
  `idUsuario` INT NOT NULL,
  `preferencias` JSON NOT NULL,
  PRIMARY KEY (`idPreferencias`),
  INDEX `fk_TblPreferencias_TblUsuario1_idx` (`idUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_TblPreferencias_TblUsuario1`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `mydb`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblEstadoNotificacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblEstadoNotificacion` (
  `idEstadoNotificacion` INT NOT NULL,
  `estadoNotificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idEstadoNotificacion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblTipoNotificacion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblTipoNotificacion` (
  `idTipoNotificacion` INT NOT NULL,
  `tipoNotificacion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idTipoNotificacion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblNotificaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblNotificaciones` (
  `idNotificacion` INT NOT NULL,
  `idUsuarioReceptor` INT NOT NULL,
  `idEstadoNotificacion` INT NOT NULL,
  `idTipoNotificacion` INT NOT NULL,
  `idProyecto` INT NOT NULL,
  `descripcionNotificacion` VARCHAR(100) NULL,
  `fechaNotificacion` DATE NOT NULL,
  PRIMARY KEY (`idNotificacion`),
  INDEX `fk_TblNotificaciones_TblUsuario1_idx` (`idUsuarioReceptor` ASC) VISIBLE,
  INDEX `fk_TblNotificaciones_TblEstadoNotificacion1_idx` (`idEstadoNotificacion` ASC) VISIBLE,
  INDEX `fk_TblNotificaciones_TblTipoNotificacion1_idx` (`idTipoNotificacion` ASC) VISIBLE,
  INDEX `fk_TblNotificaciones_TblProyectos1_idx` (`idProyecto` ASC) VISIBLE,
  CONSTRAINT `fk_TblNotificaciones_TblUsuario1`
    FOREIGN KEY (`idUsuarioReceptor`)
    REFERENCES `mydb`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblNotificaciones_TblEstadoNotificacion1`
    FOREIGN KEY (`idEstadoNotificacion`)
    REFERENCES `mydb`.`TblEstadoNotificacion` (`idEstadoNotificacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblNotificaciones_TblTipoNotificacion1`
    FOREIGN KEY (`idTipoNotificacion`)
    REFERENCES `mydb`.`TblTipoNotificacion` (`idTipoNotificacion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TblNotificaciones_TblProyectos1`
    FOREIGN KEY (`idProyecto`)
    REFERENCES `mydb`.`TblProyectos` (`idProyecto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblPagos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblPagos` (
  `idPago` INT NOT NULL,
  `idUsuarioPagador` INT NOT NULL,
  `fechaPago` DATE NOT NULL,
  `descripcionPago` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idPago`),
  INDEX `fk_TblPagos_TblUsuario1_idx` (`idUsuarioPagador` ASC) VISIBLE,
  CONSTRAINT `fk_TblPagos_TblUsuario1`
    FOREIGN KEY (`idUsuarioPagador`)
    REFERENCES `mydb`.`TblUsuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`TblInformacionTipoUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`TblInformacionTipoUsuario` (
  `idTipoUsuario` INT NOT NULL,
  `maxColaboradores` INT NOT NULL,
  `maxProyectos` INT NOT NULL,
  PRIMARY KEY (`maxColaboradores`, `maxProyectos`),
  INDEX `fk_TblInformacionTipoUsuario_TblTipoUsuario1_idx` (`idTipoUsuario` ASC) VISIBLE,
  CONSTRAINT `fk_TblInformacionTipoUsuario_TblTipoUsuario1`
    FOREIGN KEY (`idTipoUsuario`)
    REFERENCES `mydb`.`TblTipoUsuario` (`idTipoUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
