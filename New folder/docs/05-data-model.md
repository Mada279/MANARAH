# 05 — نموذج البيانات الأولي

هذه الوثيقة تصف نموذج بيانات أولي مناسب لـ Manarah OS Core + Mishkat MVP.

## الكيانات الأساسية

```txt
User
Organization
OrganizationMember
Role
Permission
Program
Beneficiary
Volunteer
Document
ImpactMetric
ImpactMetricValue
ImpactReport
AuditLog
Notification
```

## User

يمثل شخصًا داخل المنظومة.

الحقول المقترحة:

- id
- name
- email
- password_hash
- phone
- avatar_url
- status
- created_at
- updated_at

## Organization

يمثل مؤسسة أو جهة.

- id
- name
- slug
- type
- country
- city
- description
- logo_url
- status
- created_at
- updated_at

أنواع المؤسسة:

- charity
- waqf
- school
- academy
- mosque
- community_center
- initiative
- other

## OrganizationMember

يربط المستخدم بالمؤسسة.

- id
- organization_id
- user_id
- role_id
- status
- joined_at

## Role

- id
- organization_id
- name
- description
- is_system

أدوار أولية:

- owner
- admin
- program_manager
- coordinator
- viewer

## Permission

- id
- key
- description

أمثلة:

- organization.manage
- members.manage
- programs.create
- programs.update
- beneficiaries.manage
- volunteers.manage
- impact.view
- impact.manage
- reports.export

## Program

يمثل برنامجًا أو مبادرة داخل المؤسسة.

- id
- organization_id
- name
- description
- category
- status
- start_date
- end_date
- manager_id
- budget_estimate
- created_at
- updated_at

حالات البرنامج:

- draft
- active
- paused
- completed
- archived

## Beneficiary

يمثل مستفيدًا من برامج المؤسسة.

- id
- organization_id
- program_id
- name
- gender
- age_group
- phone
- city
- status
- notes
- created_at
- updated_at

## Volunteer

- id
- organization_id
- program_id
- name
- email
- phone
- skills
- total_hours
- status
- created_at
- updated_at

## Document

- id
- organization_id
- program_id
- uploaded_by
- title
- file_url
- file_type
- category
- visibility
- created_at

## ImpactMetric

تعريف المؤشر.

- id
- organization_id
- program_id
- name
- key
- unit
- description
- target_value
- created_at

أمثلة:

- beneficiaries_count
- volunteer_hours
- completed_sessions
- satisfaction_rate
- learning_completion_rate

## ImpactMetricValue

قيمة المؤشر عبر الزمن.

- id
- metric_id
- value
- period_start
- period_end
- recorded_by
- recorded_at

## ImpactReport

- id
- organization_id
- program_id
- title
- period_start
- period_end
- summary
- generated_by
- status
- created_at

## AuditLog

- id
- organization_id
- actor_user_id
- action
- entity_type
- entity_id
- metadata
- created_at

## Notification

- id
- user_id
- organization_id
- title
- body
- type
- read_at
- created_at

## علاقات مبسطة

```txt
User 1─∞ OrganizationMember ∞─1 Organization
Organization 1─∞ Program
Program 1─∞ Beneficiary
Program 1─∞ Volunteer
Program 1─∞ ImpactMetric 1─∞ ImpactMetricValue
Organization 1─∞ Document
Organization 1─∞ ImpactReport
Organization 1─∞ AuditLog
```

## ملاحظات تقنية

- يجب أن يحتوي معظم الجداول على `organization_id` لضمان Multi-tenancy.
- يجب ألا تُعرض بيانات مؤسسة لمستخدم خارجها.
- يفضل استخدام UUIDs.
- يجب إضافة soft delete لاحقًا للكيانات الحساسة.
