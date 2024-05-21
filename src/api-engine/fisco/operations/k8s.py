import logging

from kubernetes import client, config

LOG = logging.getLogger(__name__)


class FiscoK8sOperator:
    def __init__(self, namespace="baas-admin"):
        self.namespace = namespace
        config.load_incluster_config()
        self.apps_v1 = client.AppsV1Api()
        self.core_v1 = client.CoreV1Api()

    def create_node(self, name: str, group_id: int, chain_id: int):
        deployment = {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "metadata": {"name": name, "namespace": self.namespace},
            "spec": {
                "replicas": 1,
                "selector": {"matchLabels": {"app": name}},
                "template": {
                    "metadata": {"labels": {"app": name}},
                    "spec": {
                        "containers": [{
                            "name": "fisco-node",
                            "image": "fiscoorg/fisco-bcos:v3.11.0",
                            "env": [
                                {"name": "FISCO_GROUP_ID", "value": str(group_id)},
                                {"name": "FISCO_CHAIN_ID", "value": str(chain_id)},
                            ],
                            "ports": [
                                {"containerPort": 30300},
                                {"containerPort": 20200},
                                {"containerPort": 8545},
                            ],
                        }],
                    },
                },
            },
        }
        self.apps_v1.create_namespaced_deployment(
            namespace=self.namespace,
            body=deployment,
        )

    def delete_node(self, name: str):
        self.apps_v1.delete_namespaced_deployment(name=name, namespace=self.namespace)

    def get_node_status(self, name: str) -> str:
        pod_list = self.core_v1.list_namespaced_pod(
            namespace=self.namespace,
            label_selector=f"app={name}",
        )
        if pod_list.items:
            return pod_list.items[0].status.phase
        return "NOT_FOUND"
