#############################################
# 查询PVC信息
curl --location --request GET 'http://tdmq-cloud.tdmq-system.svc.cluster.local:10105/pvc?releaseName={{ .clusterId }}&label={{ .pvcLabel }}' | python3 -m json.tool


#############################################
# pvc扩容
curl -X PUT "http://tdmq-cloud:10105/pvc" -H "Authorization: 39c20f65-dc80-4db4-ac23-601eb24d9b0b" -H "Content-Type: application/json" -d '
{
  "releaseName": "{{ .clusterId }}",
  "label": "{{ .pvcLabel }}",
  "storage": {{ .pvcStorage }}
}
' | python3 -m json.tool


#############################################
# pvc 同步成最大的盘
curl -X POST "http://tdmq-cloud:10105/pvc" -H "Authorization: 39c20f65-dc80-4db4-ac23-601eb24d9b0b" -H "Content-Type: application/json" -d '
{
  "releaseName": "{{ .clusterId }}",
  "label": "{{ .pvcLabel }}"
}
' | python3 -m json.tool


#############################################
