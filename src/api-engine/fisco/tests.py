from django.test import TestCase


class DriverRegistryTest(TestCase):
    def setUp(self):
        from node.drivers import get_driver, list_drivers
        self.get_driver = get_driver
        self.list_drivers = list_drivers

    def test_fabric_driver_registered(self):
        drivers = self.list_drivers()
        self.assertIn("fabric", drivers)

    def test_fisco_driver_registered(self):
        drivers = self.list_drivers()
        self.assertIn("fisco", drivers)

    def test_get_driver_returns_instance(self):
        driver = self.get_driver("fabric")
        self.assertIsNotNone(driver)
        self.assertEqual(driver.label, "fabric")

    def test_get_fisco_driver(self):
        driver = self.get_driver("fisco")
        self.assertIsNotNone(driver)
        self.assertEqual(driver.label, "fisco")

    def test_get_unknown_driver_raises(self):
        with self.assertRaises((ValueError, KeyError)):
            self.get_driver("nonexistent")

    def test_driver_singleton(self):
        d1 = self.get_driver("fabric")
        d2 = self.get_driver("fabric")
        self.assertIs(d1, d2)

    def test_fisco_driver_singleton(self):
        d1 = self.get_driver("fisco")
        d2 = self.get_driver("fisco")
        self.assertIs(d1, d2)

    def test_fabric_driver_get_node_cmd(self):
        driver = self.get_driver("fabric")
        cmd = driver.get_node_cmd("PEER")
        self.assertIsNotNone(cmd)
        self.assertIn("peer node start", cmd)

    def test_fisco_driver_get_node_cmd(self):
        driver = self.get_driver("fisco")
        cmd = driver.get_node_cmd("GROUP_NODE")
        self.assertIsNone(cmd)
