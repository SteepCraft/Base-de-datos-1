CREATE TABLE cliente (
    id_cliente      VARCHAR2(10) PRIMARY KEY,
    nom_cliente     VARCHAR2(50) NOT NULL,
    ape_cliente     VARCHAR2(50) NOT NULL,
    dire_cliente    VARCHAR2(50),
    num_tel_cliente VARCHAR2(10)
);
ALTER TABLE cliente
  ADD CONSTRAINT unq_telefono UNIQUE (num_tel_cliente);

CREATE TABLE producto (
    codi_producto   NUMBER PRIMARY KEY,
    descrip_producto VARCHAR2(100) NOT NULL,
    precio_producto  NUMBER(10,2) NOT NULL,
    num_existencia   NUMBER DEFAULT 0
);
ALTER TABLE producto
    ADD CONSTRAINT chk_precio_pos CHECK (precio_producto > 0);
    
    
CREATE TABLE proveedor (
    id_proveedor     VARCHAR2(10) PRIMARY KEY,
    nom_proveedor    VARCHAR2(50) ,
    ape_proveedor    VARCHAR2(50) NOT NULL,
    dire_proveedor   VARCHAR2(50) NOT NULL,
    provi_proveedor  VARCHAR2(50) NOT NULL,
    num_tel_proveedor VARCHAR2(10)NOT NULL
);
ALTER TABLE proveedor
ADD CONSTRAINT unq_tel_proveedor UNIQUE (num_tel_proveedor);

CREATE TABLE ventas (
    codi_venta    NUMBER PRIMARY KEY,
    id_cliente    VARCHAR2(10) NOT NULL,
    fecha_venta   DATE DEFAULT SYSDATE,
    valor_tot     DECIMAL(10,2),
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
);
ALTER TABLE ventas
ADD CONSTRAINT chk_valor_tot CHECK (valor_tot > 0);
    

CREATE TABLE detalle_venta (
    codi_venta       NUMBER NOT NULL,
    codi_producto    NUMBER NOT NULL,
    cant_venta       NUMBER NOT NULL,
    precio_producto  NUMBER(10,2) NOT NULL,
    PRIMARY KEY (codi_venta, codi_producto),
    CONSTRAINT fk_detventa_venta FOREIGN KEY (codi_venta)
        REFERENCES ventas(codi_venta),
    CONSTRAINT fk_detventa_producto FOREIGN KEY (codi_producto)
        REFERENCES producto(codi_producto)
);



CREATE TABLE compras (
    codi_compra   NUMBER PRIMARY KEY,
    fecha_compra DATE DEFAULT SYSDATE,
    id_proveedor VARCHAR2(10) NOT NULL,
    tot_compras  NUMBER(10,2) NOT NULL,
    CONSTRAINT fk_compra_proveedor FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
);
ALTER TABLE compras
    ADD CONSTRAINT chk_tot_compras_pos CHECK (tot_compras > 0);

CREATE TABLE detalle_compras (
    codi_compra   NUMBER NOT NULL,
    codi_producto NUMBER NOT NULL,
    cant_compras  NUMBER DEFAULT 1,
    precio_unit   NUMBER(10,2) NOT NULL,
    PRIMARY KEY (codi_compra, codi_producto),
    CONSTRAINT fk_detcompra_compra FOREIGN KEY (codi_compra)
        REFERENCES compras(codi_compra),
    CONSTRAINT fk_detcompra_producto FOREIGN KEY (codi_producto)
        REFERENCES producto(codi_producto)
);
ALTER TABLE detalle_compras
    ADD CONSTRAINT chk_precio_unit_pos CHECK (precio_unit > 0);


CREATE TABLE Inventario (
    codi_producto   NUMBER NOT NULL,
    stock_actual  NUMBER NOT NULL,
    stock_inicio NUMBER,
    stock_final  NUMBER,
    fecha_regis DATE,
    CONSTRAINT fk_inventario_producto FOREIGN KEY (codi_producto)
        REFERENCES Producto(codi_producto)
);
ALTER TABLE inventario
  ADD CONSTRAINT unq_codi_producto_inv UNIQUE (codi_producto);


CREATE TABLE suministros (
    id_proveedor   VARCHAR2(10) NOT NULL,
    codi_producto  NUMBER NOT NULL,
    PRIMARY KEY (id_proveedor, codi_producto),
    CONSTRAINT fk_suministros_proveedor FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor),
    CONSTRAINT fk_suministros_producto FOREIGN KEY (codi_producto)
        REFERENCES producto(codi_producto)
);
ALTER TABLE suministros
  ADD CONSTRAINT unq_codi_producto_sumin UNIQUE (codi_producto);
