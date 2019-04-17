-- MySQL Script generated by MySQL Workbench
-- Wed Mar  6 11:23:51 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema gepo_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema gepo_db
-- -----------------------------------------------------
CREATE SCHEMA 'gepo_db' DEFAULT CHARACTER SET utf8 ;
USE 'gepo_db' ;

-- -----------------------------------------------------
-- Table TblTipoLugar
-- -----------------------------------------------------
CREATE TABLE TblTipoLugar (
  'idTipoLugar' INT NOT NULL,
  'tipoLugar' VARCHAR(200) NOT NULL,
  PRIMARY KEY ('idTipoLugar'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblLugares'
-- -----------------------------------------------------
CREATE TABLE 'TblLugares' (
  'idLugar' INT NOT NULL,
  'idLugarPadre' INT NULL,
  'idTipoLugar' INT NOT NULL,
  'nameLugar' VARCHAR(200) NOT NULL,
  PRIMARY KEY ('idLugar'),
  INDEX 'fk_TblLugares_TblTipoLugar_idx' ('idTipoLugar' ASC) VISIBLE,
  INDEX 'fk_TblLugares_TblLugares1_idx' ('idLugarPadre' ASC) VISIBLE,
  CONSTRAINT 'fk_TblLugares_TblTipoLugar'
    FOREIGN KEY ('idTipoLugar')
    REFERENCES 'TblTipoLugar' ('idTipoLugar')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblLugares_TblLugares1'
    FOREIGN KEY ('idLugarPadre')
    REFERENCES 'TblLugares' ('idLugar')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblGenero'
-- -----------------------------------------------------
CREATE TABLE 'TblGenero' (
  'idGenero' INT NOT NULL,
  'genero' VARCHAR(10) NOT NULL,
  PRIMARY KEY ('idGenero'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblPersona'
-- -----------------------------------------------------
CREATE TABLE 'TblPersona' (
  'idPersona' INT GENERATED ALWAYS AS () VIRTUAL COMMENT 'Identificador de la persona',
  'idLugarResidencia' INT NOT NULL COMMENT 'Guardara el id del lugar en que reside la persona.',
  'idGenero' INT NOT NULL,
  'namePersona' VARCHAR(50) NOT NULL COMMENT 'Almacenara el nombre de la persona',
  'lastNamePersona' VARCHAR(50) NOT NULL COMMENT 'Almacenara el apellido de la persona',
  'correoPersona' VARCHAR(50) NOT NULL COMMENT 'Almacenara el correo de la persona',
  PRIMARY KEY ('idPersona'),
  INDEX 'fk_TblPersona_TblLugares1_idx' ('idLugarResidencia' ASC) VISIBLE,
  INDEX 'fk_TblPersona_TblGenero1_idx' ('idGenero' ASC) VISIBLE,
  CONSTRAINT 'fk_TblPersona_TblLugares1'
    FOREIGN KEY ('idLugarResidencia')
    REFERENCES 'TblLugares' ('idLugar')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblPersona_TblGenero1'
    FOREIGN KEY ('idGenero')
    REFERENCES 'TblGenero' ('idGenero')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblTipoUsuario'
-- -----------------------------------------------------
CREATE TABLE 'TblTipoUsuario' (
  'idTipoUsuario' INT NOT NULL,
  'tipoUsuario' VARCHAR(45) NOT NULL,
  PRIMARY KEY ('idTipoUsuario'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblUsuario'
-- -----------------------------------------------------
CREATE TABLE 'TblUsuario' (
  'idUsuario' INT NOT NULL,
  'idPersona' INT NOT NULL COMMENT 'Identificador de la persona que creo el usuario',
  'idTipoUsuario' INT NOT NULL,
  'AliasUsuario' VARCHAR(50) NOT NULL,
  'contraseniaUsuario' VARCHAR(100) NOT NULL,
  'fotoPerfilUsuario' BLOB NULL,
  'biografiaUsuario' VARCHAR(400) NULL,
  'fechaRegistro' DATE NOT NULL,
  PRIMARY KEY ('idUsuario'),
  INDEX 'fk_TblUsuario_TblPersona1_idx' ('idPersona' ASC) VISIBLE,
  INDEX 'fk_TblUsuario_TblTipoUsuario1_idx' ('idTipoUsuario' ASC) VISIBLE,
  CONSTRAINT 'fk_TblUsuario_TblPersona1'
    FOREIGN KEY ('idPersona')
    REFERENCES 'TblPersona' ('idPersona')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblUsuario_TblTipoUsuario1'
    FOREIGN KEY ('idTipoUsuario')
    REFERENCES 'TblTipoUsuario' ('idTipoUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblEstadoSolicitud'
-- -----------------------------------------------------
CREATE TABLE 'TblEstadoSolicitud' (
  'idEstadoSolicitud' INT NOT NULL,
  'estadoSolicitud' VARCHAR(50) NOT NULL,
  PRIMARY KEY ('idEstadoSolicitud'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblSolicitudesColaboracion'
-- -----------------------------------------------------
CREATE TABLE 'TblSolicitudesColaboracion' (
  'idSolicitud' INT NOT NULL,
  'idEstadoSolicitud' INT NOT NULL,
  'idUsuarioEmisor' INT NOT NULL,
  'idUsuarioReceptor' INT NOT NULL,
  'descripcionSolicitud' VARCHAR(200) NOT NULL,
  'fechaEmisionSolicitud' DATE NOT NULL,
  'fechaRespuesta' DATE NULL,
  PRIMARY KEY ('idSolicitud'),
  INDEX 'fk_TblSolicitudesColaboracion_TblEstadoSolicitud1_idx' ('idEstadoSolicitud' ASC) VISIBLE,
  INDEX 'fk_TblSolicitudesColaboracion_TblUsuario1_idx' ('idUsuarioReceptor' ASC) VISIBLE,
  INDEX 'fk_TblSolicitudesColaboracion_TblUsuario2_idx' ('idUsuarioEmisor' ASC) VISIBLE,
  CONSTRAINT 'fk_TblSolicitudesColaboracion_TblEstadoSolicitud1'
    FOREIGN KEY ('idEstadoSolicitud')
    REFERENCES 'TblEstadoSolicitud' ('idEstadoSolicitud')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblSolicitudesColaboracion_TblUsuario1'
    FOREIGN KEY ('idUsuarioReceptor')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblSolicitudesColaboracion_TblUsuario2'
    FOREIGN KEY ('idUsuarioEmisor')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblColaboradores'
-- -----------------------------------------------------
CREATE TABLE 'TblColaboradores' (
  'idUsuario' INT NOT NULL,
  'idSolicitud' INT NOT NULL,
  INDEX 'fk_TblColaboradores_TblUsuario1_idx' ('idUsuario' ASC) VISIBLE,
  PRIMARY KEY ('idUsuario'),
  INDEX 'fk_TblColaboradores_TblSolicitudesColaboracion1_idx' ('idSolicitud' ASC) VISIBLE,
  CONSTRAINT 'fk_TblColaboradores_TblUsuario1'
    FOREIGN KEY ('idUsuario')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblColaboradores_TblSolicitudesColaboracion1'
    FOREIGN KEY ('idSolicitud')
    REFERENCES 'TblSolicitudesColaboracion' ('idSolicitud')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblModificaciones'
-- -----------------------------------------------------
CREATE TABLE 'TblModificaciones' (
  'idModificacion' INT NOT NULL,
  'idUsuarioModificador' INT NOT NULL,
  'fechaModificacion' DATE NOT NULL,
  'descripcionModificacion' VARCHAR(200) NOT NULL,
  PRIMARY KEY ('idModificacion'),
  INDEX 'fk_TblModificaciones_TblUsuario1_idx' ('idUsuarioModificador' ASC) VISIBLE,
  CONSTRAINT 'fk_TblModificaciones_TblUsuario1'
    FOREIGN KEY ('idUsuarioModificador')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblPreferencias'
-- -----------------------------------------------------
CREATE TABLE 'TblPreferencias' (
  'idPreferencias' INT NOT NULL,
  'idUsuario' INT NOT NULL,
  'preferencias' JSON NOT NULL,
  PRIMARY KEY ('idPreferencias'),
  INDEX 'fk_TblPreferencias_TblUsuario1_idx' ('idUsuario' ASC) VISIBLE,
  CONSTRAINT 'fk_TblPreferencias_TblUsuario1'
    FOREIGN KEY ('idUsuario')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblEstadoNotificacion'
-- -----------------------------------------------------
CREATE TABLE 'TblEstadoNotificacion' (
  'idEstadoNotificacion' INT NOT NULL,
  'estadoNotificacion' VARCHAR(45) NOT NULL,
  PRIMARY KEY ('idEstadoNotificacion'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblTipoNotificacion'
-- -----------------------------------------------------
CREATE TABLE 'TblTipoNotificacion' (
  'idTipoNotificacion' INT NOT NULL,
  'tipoNotificacion' VARCHAR(45) NOT NULL,
  PRIMARY KEY ('idTipoNotificacion'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblNotificaciones'
-- -----------------------------------------------------
CREATE TABLE 'TblNotificaciones' (
  'idNotificacion' INT NOT NULL,
  'idUsuarioReceptor' INT NOT NULL,
  'idEstadoNotificacion' INT NOT NULL,
  'idTipoNotificacion' INT NOT NULL,
  'descripcionNotificacion' VARCHAR(100) NULL,
  'fechaNotificacion' DATE NOT NULL,
  PRIMARY KEY ('idNotificacion'),
  INDEX 'fk_TblNotificaciones_TblUsuario1_idx' ('idUsuarioReceptor' ASC) VISIBLE,
  INDEX 'fk_TblNotificaciones_TblEstadoNotificacion1_idx' ('idEstadoNotificacion' ASC) VISIBLE,
  INDEX 'fk_TblNotificaciones_TblTipoNotificacion1_idx' ('idTipoNotificacion' ASC) VISIBLE,
  CONSTRAINT 'fk_TblNotificaciones_TblUsuario1'
    FOREIGN KEY ('idUsuarioReceptor')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblNotificaciones_TblEstadoNotificacion1'
    FOREIGN KEY ('idEstadoNotificacion')
    REFERENCES 'TblEstadoNotificacion' ('idEstadoNotificacion')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblNotificaciones_TblTipoNotificacion1'
    FOREIGN KEY ('idTipoNotificacion')
    REFERENCES 'TblTipoNotificacion' ('idTipoNotificacion')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblPagos'
-- -----------------------------------------------------
CREATE TABLE 'TblPagos' (
  'idPago' INT NOT NULL,
  'fechaPago' DATE NOT NULL,
  'descripcionPago' VARCHAR(200) NOT NULL,
  PRIMARY KEY ('idPago'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblInformacionTipoUsuario'
-- -----------------------------------------------------
CREATE TABLE 'TblInformacionTipoUsuario' (
  'idTipoUsuario' INT NOT NULL,
  'maxColaboradores' INT NOT NULL,
  'maxProyectos' INT NOT NULL,
  INDEX 'fk_TblInformacionTipoUsuario_TblTipoUsuario1_idx' ('idTipoUsuario' ASC) VISIBLE,
  CONSTRAINT 'fk_TblInformacionTipoUsuario_TblTipoUsuario1'
    FOREIGN KEY ('idTipoUsuario')
    REFERENCES 'TblTipoUsuario' ('idTipoUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblCarpetas'
-- -----------------------------------------------------
CREATE TABLE 'TblCarpetas' (
  'idCarpeta' INT NOT NULL,
  'idUsuarioCreador' INT NOT NULL,
  'idCarpetaPadre' INT NULL,
  'nombreCarpeta' VARCHAR(50) NOT NULL,
  'fechaCreacion' DATE NOT NULL,
  PRIMARY KEY ('idCarpeta'),
  INDEX 'fk_TblCarpetas_TblUsuario1_idx' ('idUsuarioCreador' ASC) VISIBLE,
  INDEX 'fk_TblCarpetas_TblCarpetas1_idx' ('idCarpetaPadre' ASC) VISIBLE,
  CONSTRAINT 'fk_TblCarpetas_TblUsuario1'
    FOREIGN KEY ('idUsuarioCreador')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblCarpetas_TblCarpetas1'
    FOREIGN KEY ('idCarpetaPadre')
    REFERENCES 'TblCarpetas' ('idCarpeta')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblProyectos'
-- -----------------------------------------------------
CREATE TABLE 'TblProyectos' (
  'idProyecto' INT NOT NULL,
  'idCarpetaContenedora' INT NOT NULL,
  'idUsuarioCreador' INT NOT NULL,
  'nombreProyecto' VARCHAR(50) NOT NULL,
  'descripcionProyecto' VARCHAR(150) NULL,
  'fotoProyecto' BLOB NULL,
  'fechaCreacion' DATE NOT NULL,
  PRIMARY KEY ('idProyecto'),
  INDEX 'fk_TblProyectos_TblCarpetas1_idx' ('idCarpetaContenedora' ASC) VISIBLE,
  INDEX 'fk_TblProyectos_TblUsuario1_idx' ('idUsuarioCreador' ASC) VISIBLE,
  CONSTRAINT 'fk_TblProyectos_TblCarpetas1'
    FOREIGN KEY ('idCarpetaContenedora')
    REFERENCES 'TblCarpetas' ('idCarpeta')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblProyectos_TblUsuario1'
    FOREIGN KEY ('idUsuarioCreador')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblExtensiones'
-- -----------------------------------------------------
CREATE TABLE 'TblExtensiones' (
  'idExtension' INT NOT NULL,
  'Extension' VARCHAR(5) NOT NULL,
  PRIMARY KEY ('idExtension'))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblArchivos'
-- -----------------------------------------------------
CREATE TABLE 'TblArchivos' (
  'idArchivo' INT NOT NULL,
  'idProyectoContenedor' INT NOT NULL,
  'idUsuarioCreador' INT NOT NULL,
  'idExtensionArchivo' INT NOT NULL,
  'nombreArchivo' VARCHAR(50) NOT NULL,
  'datoArchivo' MEDIUMTEXT NOT NULL,
  'fechaCreacion' DATE NOT NULL,
  PRIMARY KEY ('idArchivo'),
  INDEX 'fk_TblArchivos_TblProyectos1_idx' ('idProyectoContenedor' ASC) VISIBLE,
  INDEX 'fk_TblArchivos_TblUsuario1_idx' ('idUsuarioCreador' ASC) VISIBLE,
  INDEX 'fk_TblArchivos_TblExtensiones1_idx' ('idExtensionArchivo' ASC) VISIBLE,
  CONSTRAINT 'fk_TblArchivos_TblProyectos1'
    FOREIGN KEY ('idProyectoContenedor')
    REFERENCES 'TblProyectos' ('idProyecto')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblArchivos_TblUsuario1'
    FOREIGN KEY ('idUsuarioCreador')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblArchivos_TblExtensiones1'
    FOREIGN KEY ('idExtensionArchivo')
    REFERENCES 'TblExtensiones' ('idExtension')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblArchivosCompartidos'
-- -----------------------------------------------------
CREATE TABLE 'TblArchivosCompartidos' (
  'idArchivo' INT NOT NULL,
  'idUsuarioColaborador' INT NOT NULL,
  PRIMARY KEY ('idArchivo', 'idUsuarioColaborador'),
  INDEX 'fk_TblArchivos_has_TblColaboradores_TblColaboradores1_idx' ('idUsuarioColaborador' ASC) VISIBLE,
  INDEX 'fk_TblArchivos_has_TblColaboradores_TblArchivos1_idx' ('idArchivo' ASC) VISIBLE,
  CONSTRAINT 'fk_TblArchivos_has_TblColaboradores_TblArchivos1'
    FOREIGN KEY ('idArchivo')
    REFERENCES 'TblArchivos' ('idArchivo')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblArchivos_has_TblColaboradores_TblColaboradores1'
    FOREIGN KEY ('idUsuarioColaborador')
    REFERENCES 'TblColaboradores' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblProyectosCompartidos'
-- -----------------------------------------------------
CREATE TABLE 'TblProyectosCompartidos' (
  'idProyecto' INT NOT NULL,
  'idUsuarioColaborador' INT NOT NULL,
  PRIMARY KEY ('idProyecto', 'idUsuarioColaborador'),
  INDEX 'fk_TblProyectos_has_TblColaboradores_TblColaboradores1_idx' ('idUsuarioColaborador' ASC) VISIBLE,
  INDEX 'fk_TblProyectos_has_TblColaboradores_TblProyectos1_idx' ('idProyecto' ASC) VISIBLE,
  CONSTRAINT 'fk_TblProyectos_has_TblColaboradores_TblProyectos1'
    FOREIGN KEY ('idProyecto')
    REFERENCES 'TblProyectos' ('idProyecto')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblProyectos_has_TblColaboradores_TblColaboradores1'
    FOREIGN KEY ('idUsuarioColaborador')
    REFERENCES 'TblColaboradores' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblCarpetasCompartidas'
-- -----------------------------------------------------
CREATE TABLE 'TblCarpetasCompartidas' (
  'idCarpeta' INT NOT NULL,
  'idUsuarioColaborador' INT NOT NULL,
  PRIMARY KEY ('idCarpeta', 'idUsuarioColaborador'),
  INDEX 'fk_TblCarpetas_has_TblColaboradores_TblColaboradores1_idx' ('idUsuarioColaborador' ASC) VISIBLE,
  INDEX 'fk_TblCarpetas_has_TblColaboradores_TblCarpetas1_idx' ('idCarpeta' ASC) VISIBLE,
  CONSTRAINT 'fk_TblCarpetas_has_TblColaboradores_TblCarpetas1'
    FOREIGN KEY ('idCarpeta')
    REFERENCES 'TblCarpetas' ('idCarpeta')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblCarpetas_has_TblColaboradores_TblColaboradores1'
    FOREIGN KEY ('idUsuarioColaborador')
    REFERENCES 'TblColaboradores' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblArchivosModificados'
-- -----------------------------------------------------
CREATE TABLE 'TblArchivosModificados' (
  'idArchivo' INT NOT NULL,
  'idModificacion' INT NOT NULL,
  PRIMARY KEY ('idArchivo', 'idModificacion'),
  INDEX 'fk_TblArchivos_has_TblModificaciones_TblModificaciones1_idx' ('idModificacion' ASC) VISIBLE,
  INDEX 'fk_TblArchivos_has_TblModificaciones_TblArchivos1_idx' ('idArchivo' ASC) VISIBLE,
  CONSTRAINT 'fk_TblArchivos_has_TblModificaciones_TblArchivos1'
    FOREIGN KEY ('idArchivo')
    REFERENCES 'TblArchivos' ('idArchivo')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblArchivos_has_TblModificaciones_TblModificaciones1'
    FOREIGN KEY ('idModificacion')
    REFERENCES 'TblModificaciones' ('idModificacion')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblProyectosModificados'
-- -----------------------------------------------------
CREATE TABLE 'TblProyectosModificados' (
  'idProyecto' INT NOT NULL,
  'idModificacion' INT NOT NULL,
  PRIMARY KEY ('idProyecto', 'idModificacion'),
  INDEX 'fk_TblProyectos_has_TblModificaciones_TblModificaciones1_idx' ('idModificacion' ASC) VISIBLE,
  INDEX 'fk_TblProyectos_has_TblModificaciones_TblProyectos1_idx' ('idProyecto' ASC) VISIBLE,
  CONSTRAINT 'fk_TblProyectos_has_TblModificaciones_TblProyectos1'
    FOREIGN KEY ('idProyecto')
    REFERENCES 'TblProyectos' ('idProyecto')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblProyectos_has_TblModificaciones_TblModificaciones1'
    FOREIGN KEY ('idModificacion')
    REFERENCES 'TblModificaciones' ('idModificacion')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'TblCarpetasModificadas'
-- -----------------------------------------------------
CREATE TABLE 'TblCarpetasModificadas' (
  'idCarpeta' INT NOT NULL,
  'idModificacion' INT NOT NULL,
  PRIMARY KEY ('idCarpeta', 'idModificacion'),
  INDEX 'fk_TblCarpetas_has_TblModificaciones_TblModificaciones1_idx' ('idModificacion' ASC) VISIBLE,
  INDEX 'fk_TblCarpetas_has_TblModificaciones_TblCarpetas1_idx' ('idCarpeta' ASC) VISIBLE,
  CONSTRAINT 'fk_TblCarpetas_has_TblModificaciones_TblCarpetas1'
    FOREIGN KEY ('idCarpeta')
    REFERENCES 'TblCarpetas' ('idCarpeta')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblCarpetas_has_TblModificaciones_TblModificaciones1'
    FOREIGN KEY ('idModificacion')
    REFERENCES 'TblModificaciones' ('idModificacion')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table 'Pagos_x_Usuario'
-- -----------------------------------------------------
CREATE TABLE 'Pagos_x_Usuario' (
  'idPago' INT NOT NULL,
  'idUsuario' INT NOT NULL,
  PRIMARY KEY ('idPago', 'idUsuario'),
  INDEX 'fk_TblPagos_has_TblUsuario_TblUsuario1_idx' ('idUsuario' ASC) VISIBLE,
  INDEX 'fk_TblPagos_has_TblUsuario_TblPagos1_idx' ('idPago' ASC) VISIBLE,
  CONSTRAINT 'fk_TblPagos_has_TblUsuario_TblPagos1'
    FOREIGN KEY ('idPago')
    REFERENCES 'TblPagos' ('idPago')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT 'fk_TblPagos_has_TblUsuario_TblUsuario1'
    FOREIGN KEY ('idUsuario')
    REFERENCES 'TblUsuario' ('idUsuario')
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;