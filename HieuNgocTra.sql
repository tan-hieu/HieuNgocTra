--CREATE DATABASE HieuNgocTra;
--GO

--USE HieuNgocTra;
--GO

-- =========================
-- 1. BẢNG ROLE
-- =========================
CREATE TABLE roles (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    role_name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255)
);
GO

-- =========================
-- 2. BẢNG USER
-- =========================
CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    role_id BIGINT NOT NULL,
    full_name NVARCHAR(150) NOT NULL,
    username NVARCHAR(100) NOT NULL UNIQUE,
    email NVARCHAR(150) NOT NULL UNIQUE,
    phone NVARCHAR(20) UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    avatar_url NVARCHAR(255),
    address NVARCHAR(MAX),
    status NVARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOCKED')),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
);
GO

-- =========================
-- 3. BẢNG DANH MỤC
-- =========================
CREATE TABLE categories (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(120) NOT NULL UNIQUE,
    slug NVARCHAR(150) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    status NVARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- =========================
-- 4. BẢNG SẢN PHẨM TRÀ
-- =========================
CREATE TABLE products (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    category_id BIGINT NOT NULL,
    product_code NVARCHAR(50) NOT NULL UNIQUE,
    name NVARCHAR(200) NOT NULL,
    slug NVARCHAR(220) NOT NULL UNIQUE,
    tea_type NVARCHAR(100),
    brand NVARCHAR(150),
    origin NVARCHAR(150),
    weight NVARCHAR(50),
    price DECIMAL(12,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    short_description NVARCHAR(500),
    description NVARCHAR(MAX),
    flavor_notes NVARCHAR(500),
    brewing_guide NVARCHAR(MAX),
    main_image_url NVARCHAR(255),
    status NVARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK')),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
);
GO

-- =========================
-- 5. BẢNG ẢNH SẢN PHẨM
-- =========================
CREATE TABLE product_images (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url NVARCHAR(255) NOT NULL,
    is_main BIT NOT NULL DEFAULT 0,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE
);
GO

-- =========================
-- 6. BẢNG GIỎ HÀNG
-- =========================
CREATE TABLE carts (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_carts_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
GO

-- =========================
-- 7. CHI TIẾT GIỎ HÀNG
-- =========================
CREATE TABLE cart_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES carts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
);
GO

-- =========================
-- 8. BẢNG ĐƠN HÀNG
-- =========================
CREATE TABLE orders (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_code NVARCHAR(50) NOT NULL UNIQUE,
    receiver_name NVARCHAR(150) NOT NULL,
    receiver_phone NVARCHAR(20) NOT NULL,
    shipping_address NVARCHAR(MAX) NOT NULL,
    note NVARCHAR(MAX),
    payment_method NVARCHAR(20) NOT NULL DEFAULT 'COD'
        CHECK (payment_method IN ('COD', 'BANK_TRANSFER')),
    payment_status NVARCHAR(20) NOT NULL DEFAULT 'UNPAID'
        CHECK (payment_status IN ('UNPAID', 'PAID', 'REFUNDED')),
    order_status NVARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (order_status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED')),
    total_amount DECIMAL(12,2) NOT NULL,
    admin_note NVARCHAR(MAX),
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

-- =========================
-- 9. CHI TIẾT ĐƠN HÀNG
-- =========================
CREATE TABLE order_items (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name NVARCHAR(200) NOT NULL,
    product_image_url NVARCHAR(255),
    unit_price DECIMAL(12,2) NOT NULL,
    quantity INT NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
);
GO

-- =========================
-- 10. LỊCH SỬ TRẠNG THÁI ĐƠN HÀNG
-- =========================
CREATE TABLE order_status_history (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status NVARCHAR(20) NOT NULL
        CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED', 'CANCELLED')),
    changed_by BIGINT NULL,
    note NVARCHAR(255),
    changed_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_order_status_history_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_status_history_user
        FOREIGN KEY (changed_by) REFERENCES users(id)
);
GO

--=======================
--11.xuất xứ
--=======================
CREATE TABLE origins (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        origin_code NVARCHAR(30) NOT NULL UNIQUE,
        name NVARCHAR(150) NOT NULL,
        slug NVARCHAR(180) NOT NULL UNIQUE,
        region NVARCHAR(150) NOT NULL,
        description NVARCHAR(MAX),
        image_url NVARCHAR(500),
        status NVARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
            CHECK (status IN ('ACTIVE', 'INACTIVE')),
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT uq_origins_name_region UNIQUE (name, region)
);
GO


INSERT INTO roles (role_name, description)
VALUES 
  ('USER',  N'Người dùng'),
  ('ADMIN', N'Quản trị viên');
GO

INSERT INTO categories (name, slug, description)
VALUES
  (N'Trà Shan Tuyết', 'tra-shan-tuyet', N'Trà Shan Tuyết cao cấp'),
  (N'Trà Ô Long',     'tra-o-long',     N'Trà Ô Long thượng hạng'),
  (N'Trà Atiso',       'tra-atiso',       N'Trà Atiso Đà Lạt'),
  (N'Trà Xanh',       'tra-xanh',       N'Trà Xanh truyền thống'),
  (N'Trà Đen',        'tra-den',        N'Trà Đen đậm vị');

