-- Tạo Database (nếu cần)
CREATE DATABASE ShoeStoreDBH;
GO

USE ShoeStoreDBH;
GO


-- Bảng người dùng
CREATE TABLE [User] (
    User_ID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100),
    Password NVARCHAR(100),
    Phone NVARCHAR(20),
    Role NVARCHAR(50),
    Create_date DATE
);

-- Bảng sản phẩm
CREATE TABLE Product (
    Product_ID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(255),
    UnitPrice DECIMAL(10,2),
    Discount DECIMAL(5,2),
    Images NVARCHAR(MAX),
    Gender NVARCHAR(20),
    Category NVARCHAR(100),
    Brand NVARCHAR(100)
);

-- Bảng phiên bản sản phẩm (biến thể: size, màu,...)
CREATE TABLE Variant (
    Variant_ID INT PRIMARY KEY IDENTITY(1,1),
    Product_ID INT,
    Size NVARCHAR(10),
    Color NVARCHAR(50),
    Stock INT,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID)
);

-- Bảng giỏ hàng
CREATE TABLE Cart (
    Cart_ID INT PRIMARY KEY IDENTITY(1,1),
    Total_Price DECIMAL(10,2),
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES [User](User_ID)
);

-- Chi tiết giỏ hàng
CREATE TABLE CartItem (
    Cart_ID INT,
    Variant_ID INT,
    Quantity INT,
    Unit_price DECIMAL(10,2),
    PRIMARY KEY (Cart_ID, Variant_ID),
    FOREIGN KEY (Cart_ID) REFERENCES Cart(Cart_ID),
    FOREIGN KEY (Variant_ID) REFERENCES Variant(Variant_ID)
);

-- Bảng đơn hàng
CREATE TABLE [Order] (
    Order_ID INT PRIMARY KEY IDENTITY(1,1),
    User_ID INT,
    Order_date DATE,
    Status NVARCHAR(50),
    Total_Price DECIMAL(10,2),
    Ship_info NVARCHAR(MAX),
    FOREIGN KEY (User_ID) REFERENCES [User](User_ID)
);

-- Chi tiết đơn hàng
CREATE TABLE OrderItem (
    Order_ID INT,
    Variant_ID INT,
    Quantity INT,
    Unit_price DECIMAL(10,2),
    PRIMARY KEY (Order_ID, Variant_ID),
    FOREIGN KEY (Order_ID) REFERENCES [Order](Order_ID),
    FOREIGN KEY (Variant_ID) REFERENCES Variant(Variant_ID)
);

-- Bảng thanh toán
CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY IDENTITY(1,1),
    Order_ID INT,
    Method NVARCHAR(50),
    Date DATE,
    Status NVARCHAR(50),
    Amount DECIMAL(10,2),
    FOREIGN KEY (Order_ID) REFERENCES [Order](Order_ID)
);



INSERT INTO [User] (Username, Password, Phone, Role, Create_date)
VALUES 
('admin',     '123456', '0900000001', 'admin',   '2025-05-07 23:18:34.190'),
('customer1', '123456', '0900000002', 'customer','2025-05-07 23:18:34.190'),
('customer2', '123456', '0900000003', 'customer','2025-05-07 23:18:34.190');

-- Bật IDENTITY_INSERT cho bảng Product
SET IDENTITY_INSERT [Product] OFF;

-- Chèn dữ liệu vào bảng Product với Product_ID cụ thể
INSERT INTO Product (Product_ID, Name, UnitPrice, Discount, Images, Gender, Category, Brand) VALUES
(1, N'Giày chạy bộ Nam Alpha', 1400000, 0.3, N'/Static/Image/product/1.webp', N'Nam', N'Chạy bộ', N'Reebok'),
(2, N'Giày chạy bộ Nữ Beta', 1540000, 0.3, N'/Static/Image/product/2.webp', N'Nữ', N'Chạy bộ', N'Puma'),
(3, N'Giày cầu lông Nam Gamma', 1440000, 0.2, N'/Static/Image/product/3.jpg', N'Nam', N'Cầu lông', N'Reebok'),
(4, N'Giày cầu lông Nữ Delta', 950000, 0.5, N'/Static/Image/product/4.jpg', N'Nữ', N'Cầu lông', N'Nike'),
(5, N'Giày bóng đá Nam Epsilon', 2240000, 0.3, N'/Static/Image/product/5.webp', N'Nam', N'Bóng đá', N'Vans'),
(6, N'Giày bóng đá Nữ Zeta', 1860000, 0.4, N'/Static/Image/product/6.webp', N'Nữ', N'Bóng đá', N'Reebok'),
(7, N'Giày bóng rổ Nam Eta', 2250000, 0.5, N'/Static/Image/product/7.jpg', N'Nam', N'Bóng rổ', N'Puma'),
(8, N'Giày bóng rổ Nữ Theta', 3360000, 0.2, N'/Static/Image/product/8.webp', N'Nữ', N'Bóng rổ', N'Nike'),
(9, N'Giày golf Nam Iota', 2500000, 0.5, N'/Static/Image/product/9.jpg', N'Nam', N'Golf', N'Vans'),
(10, N'Giày golf Nữ Kappa', 4320000, 0.1, N'/Static/Image/product/10.webp', N'Nữ', N'Golf', N'Reebok'),
(11, N'Giày tennis Nam Lambda', 1800000, 0.5, N'/Static/Image/product/11.webp', N'Nam', N'Tennis', N'Reebok'),
(12, N'Giày tennis Nữ Mu', 1700000, 0.5, N'/Static/Image/product/12.webp', N'Nữ', N'Tennis', N'Reebok'),
(13, N'Giày chạy bộ Nam Alpha2', 800000, 0.6, N'/Static/Image/product/1.webp', N'Nam', N'Chạy bộ', N'Nike'),
(14, N'Giày chạy bộ Nữ Beta2', 880000, 0.6, N'/Static/Image/product/2.webp', N'Nữ', N'Chạy bộ', N'Nike'),
(15, N'Giày cầu lông Nam Gamma2', 540000, 0.7, N'/Static/Image/product/3.jpg', N'Nam', N'Cầu lông', N'Reebok'),
(16, N'Giày cầu lông Nữ Delta2', 760000, 0.6, N'/Static/Image/product/4.jpg', N'Nữ', N'Cầu lông', N'Reebok'),
(17, N'Giày bóng đá Nam Epsilon2', 960000, 0.7, N'/Static/Image/product/5.webp', N'Nam', N'Bóng đá', N'Reebok'),
(18, N'Giày bóng đá Nữ Zeta2', 1240000, 0.6, N'/Static/Image/product/6.webp', N'Nữ', N'Bóng đá', N'Reebok'),
(19, N'Giày bóng rổ Nam Eta2', 1350000, 0.7, N'/Static/Image/product/7.jpg', N'Nam', N'Bóng rổ', N'Adidas'),
(20, N'Giày bóng rổ Nữ Theta2', 1680000, 0.6, N'/Static/Image/product/8.webp', N'Nữ', N'Bóng rổ', N'Reebok'),
(21, N'Giày chạy bộ Nam Iota2', 840000, 0.6, N'/Static/Image/product/9.jpg', N'Nam', N'Chạy bộ', N'Nike'),
(22, N'Giày chạy bộ Nữ Kappa2', 920000, 0.6, N'/Static/Image/product/10.webp', N'Nữ', N'Chạy bộ', N'Nike'),
(23, N'Giày tennis Nam Lambda2', 750000, 0.7, N'/Static/Image/product/11.webp', N'Nam', N'Tennis', N'Adidas'),
(24, N'Giày tennis Nữ Mu2', 1080000, 0.6, N'/Static/Image/product/12.webp', N'Nữ', N'Tennis', N'Adidas'),
(25, N'Giày tập gym Nam Nu2', 900000, 0.7, N'/Static/Image/product/1.webp', N'Nam', N'Gym', N'Reebok'),
(26, N'Giày tập gym Nữ Xi2', 1160000, 0.6, N'/Static/Image/product/2.webp', N'Nữ', N'Gym', N'Reebok'),
(27, N'Giày leo núi Nam Omicron2', 1260000, 0.7, N'/Static/Image/product/3.jpg', N'Nam', N'Leo núi', N'Puma'),
(28, N'Giày leo núi Nữ Pi2', 1600000, 0.6, N'/Static/Image/product/4.jpg', N'Nữ', N'Leo núi', N'Vans'),
(29, N'Giày đi bộ Nam Rho2', 1000000, 0.6, N'/Static/Image/product/5.webp', N'Nam', N'Đi bộ', N'Nike'),
(30, N'Giày đi bộ Nữ Sigma2', 960000, 0.6, N'/Static/Image/product/6.webp', N'Nữ', N'Đi bộ', N'Nike'),
(31, N'Giày đá cầu Nam Tau2', 570000, 0.7, N'/Static/Image/product/7.jpg', N'Nam', N'Đá cầu', N'Adidas'),
(32, N'Giày đá cầu Nữ Upsilon2', 880000, 0.6, N'/Static/Image/product/8.webp', N'Nữ', N'Đá cầu', N'Adidas'),
(33, N'Giày bóng bàn Nam Phi2', 840000, 0.7, N'/Static/Image/product/9.jpg', N'Nam', N'Bóng bàn', N'Reebok'),
(34, N'Giày bóng bàn Nữ Chi2', 1040000, 0.6, N'/Static/Image/product/10.webp', N'Nữ', N'Bóng bàn', N'Reebok'),
(35, N'Giày tập thể thao Nam Psi2', 960000, 0.7, N'/Static/Image/product/11.webp', N'Nam', N'Tập thể thao', N'Puma'),
(36, N'Giày tập thể thao Nữ Omega2', 1240000, 0.6, N'/Static/Image/product/12.webp', N'Nữ', N'Tập thể thao', N'Vans');
 
 Delete from Product

-- Bật IDENTITY_INSERT cho bảng Variant
SET IDENTITY_INSERT Variant ON;

-- Chèn dữ liệu vào bảng Variant với Variant_ID cụ thể
INSERT INTO Variant (Variant_ID, Product_ID, Size, Color, Stock) VALUES
(1, 1, N'M', N'Xanh', 30),
(2, 2, N'M', N'Hồng', 25),
(3, 3, N'M', N'Trắng', 20),
(4, 4, N'M', N'Đỏ', 18),
(5, 5, N'M', N'Xanh lá', 15),
(6, 6, N'M', N'Tím', 22),
(7, 7, N'M', N'Đen', 10),
(8, 8, N'M', N'Cam', 12),
(9, 9, N'M', N'Trắng', 8),
(10, 10, N'M', N'Xám', 9),
(11, 11, N'M', N'Vàng', 14),
(12, 12, N'M', N'Hồng', 13),
(13, 13, N'M', N'Xanh', 30),
(14, 14, N'M', N'Hồng', 25),
(15, 15, N'M', N'Trắng', 20),
(16, 16, N'M', N'Đỏ', 18),
(17, 17, N'M', N'Xanh lá', 15),
(18, 18, N'M', N'Tím', 22),
(19, 19, N'M', N'Đen', 10),
(20, 20, N'M', N'Cam', 12),
(21, 21, N'M', N'Xám', 28),
(22, 22, N'M', N'Hồng nhạt', 20),
(23, 23, N'M', N'Trắng', 25),
(24, 24, N'M', N'Tím nhạt', 18),
(25, 25, N'M', N'Đen đỏ', 15),
(26, 26, N'M', N'Xanh ngọc', 22),
(27, 27, N'M', N'Xanh đậm', 10),
(28, 28, N'M', N'Nâu', 12),
(29, 29, N'M', N'Xanh biển', 25),
(30, 30, N'M', N'Hồng cam', 20),
(31, 31, N'M', N'Trắng đen', 30),
(32, 32, N'M', N'Vàng', 15),
(33, 33, N'M', N'Xanh đen', 12),
(34, 34, N'M', N'Tím đậm', 14),
(35, 35, N'M', N'Xám bạc', 18),
(36, 36, N'M', N'Đỏ đô', 16);

delete from Variant