# WeforTraeAI 项目智能体规则

## 基本约束

- 所有需求相关分支、PR、TSD 和发布记录必须包含 `REQ-ID`。
- 开始开发前确认 PRD 与 TSD 状态为 Approved，并记录所用版本。
- 只修改当前任务范围内的文件；发现范围外问题时先报告，不顺手重构。
- 禁止读取或输出真实密钥、生产用户数据和未脱敏日志。
- 禁止由智能体执行生产部署、生产数据修改或最终 PR 合并。
- 修改业务逻辑必须补充对应测试；如未运行测试，明确说明原因。
- 数据库变更必须兼容旧版本，并提供迁移、验证和回滚方案。
- PR 描述必须包含变更摘要、需求链接、测试证据、风险和回滚方式。

## 分支命名

- 功能：`feat/REQ-XXXX-简短描述`
- 修复：`fix/REQ-XXXX-简短描述`
- 热修复：`hotfix/REQ-XXXX-简短描述`
- 文档：`docs/REQ-XXXX-简短描述`

## 项目命令

技术栈：前端 Vue 3 + Vite，后端 Java + Spring Boot（Maven）。

### 前端（apps/ 目录）

- 格式检查：`cd apps && npm run format`
- 静态检查：`cd apps && npm run lint`
- 单元测试：`cd apps && npm run test:unit`
- 构建：`cd apps && npm run build`

### 后端（services/ 目录）

- 格式检查：`cd services && mvn spotless:check`
- 静态检查：`cd services && mvn checkstyle:check`
- 单元测试：`cd services && mvn test`
- 集成测试：`cd services && mvn verify -DskipUnitTests`
- 构建：`cd services && mvn clean package -DskipTests`

> 如实际项目使用 pnpm/yarn 或 Gradle，替换对应包管理器和构建工具即可。

## 目录结构约定

```
/apps/        # 前端应用
/services/    # 后端服务
/tests/       # 测试代码
/deploy/      # 部署配置
/docs/        # 项目文档（TSD、ADR等）
```

## 参考文档

- 研发全流程：[rd-playbook 研发全流程设计](https://github.com/deepseekeddy/rd-playbook/blob/main/研发全流程设计.md)
- 团队台账：[rd-playbook starter/01](https://github.com/deepseekeddy/rd-playbook/blob/main/starter/01-团队与责任台账.csv)
