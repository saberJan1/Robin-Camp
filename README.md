# Movie Rating API

这是一个基于 Go 语言开发的电影评分 API 服务，支持电影管理、评分提交和聚合查询，并集成了第三方票房 API。

## 项目结构

```
.
├── cmd/
│   └── server/          # 主程序入口
├── internal/
│   ├── api/            # API 层
│   │   ├── handlers/   # HTTP 处理器
│   │   ├── middleware/ # 中间件
│   │   └── router.go   # 路由配置
│   ├── client/         # 外部 API 客户端
│   ├── config/         # 配置管理
│   ├── database/       # 数据库连接和迁移
│   ├── models/         # 数据模型
│   ├── repository/     # 数据访问层
│   └── service/        # 业务逻辑层
├── migrations/         # 数据库迁移文件
├── docker-compose.yml  # Docker Compose 配置
├── Dockerfile          # Docker 镜像构建文件
├── Makefile           # Make 命令
└── .env.example       # 环境变量示例

```

## 技术栈

- **语言**: Go 1.21
- **Web 框架**: Gorilla Mux
- **数据库**: PostgreSQL 15
- **容器化**: Docker & Docker Compose

## 快速开始

### 前置要求

- Docker
- Docker Compose
- Make (可选)

### 1. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，填写必要的配置
```

### 2. 启动服务

```bash
make docker-up
# 或者
docker compose up -d --build
```

### 3. 运行 E2E 测试

```bash
make test-e2e
# 或者
bash ./e2e-test.sh
```

### 4. 停止服务

```bash
make docker-down
# 或者
docker compose down -v
```

## API 端点

### 健康检查
- `GET /healthz` - 健康检查

### 电影管理
- `GET /movies` - 列出电影（支持过滤和分页）
- `POST /movies` - 创建电影（需要认证）

### 评分系统
- `POST /movies/{title}/ratings` - 提交评分（需要 X-Rater-Id）
- `GET /movies/{title}/rating` - 获取评分聚合

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | 8080 |
| `AUTH_TOKEN` | Bearer Token | - |
| `DB_URL` | 数据库连接字符串 | - |
| `BOXOFFICE_URL` | 票房 API 地址 | - |
| `BOXOFFICE_API_KEY` | 票房 API 密钥 | - |

## 数据库设计

### movies 表
存储电影基本信息

### box_office 表
存储票房数据（与 movies 1:1 关联）

### ratings 表
存储用户评分（支持 Upsert）

## 开发说明

### 本地开发

```bash
# 安装依赖
go mod download

# 运行服务
go run cmd/server/main.go
```

### 添加新的迁移

在 `migrations/` 目录下创建新的 SQL 文件：
- `XXX_description.up.sql` - 升级脚本
- `XXX_description.down.sql` - 回滚脚本

## 设计思路

详见 `PRODUCT_PRD_CN.md` 文档。

## License

MIT
