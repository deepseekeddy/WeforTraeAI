# WeforTraeAI

Wefor Digital 研发团队业务代码仓库。

## 研发流程

本仓库遵循 [rd-playbook](https://github.com/deepseekeddy/rd-playbook) 定义的 TRAE 全流程协作规范。

- 流程设计与操作手册：见 rd-playbook 仓库
- 团队与责任台账：[rd-playbook/starter/01](https://github.com/deepseekeddy/rd-playbook/blob/main/starter/01-团队与责任台账.csv)
- 企业 Skill 库：rd-playbook/skills/

## 开发约定

- 所有需求使用 `REQ-YYYY-NNN` 编号，贯穿 Issue、分支、PR、文档
- AI 辅助开发使用 Trae，项目规则见 [AGENTS.md](AGENTS.md)
- 代码变更必须通过 PR，禁止直接 push main
- PR 必须关联 REQ-ID、测试证据和回滚方案

## 目录结构

```
/apps/        # 前端应用
/services/    # 后端服务
/tests/       # 测试代码
/deploy/      # 部署配置
/docs/        # TSD、ADR 等技术文档
```
