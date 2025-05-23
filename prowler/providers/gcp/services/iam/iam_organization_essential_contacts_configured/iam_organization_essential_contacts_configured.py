from prowler.lib.check.models import Check, Check_Report_GCP
from prowler.providers.gcp.services.iam.essentialcontacts_client import (
    essentialcontacts_client,
)


class iam_organization_essential_contacts_configured(Check):
    def execute(self) -> Check_Report_GCP:
        findings = []
        for org in essentialcontacts_client.organizations:
            report = Check_Report_GCP(
                metadata=self.metadata(),
                resource=org,
                project_id=essentialcontacts_client.default_project_id,
                location=essentialcontacts_client.region,
            )
            report.status = "FAIL"
            report.status_extended = (
                f"Organization {org.name} does not have essential contacts configured."
            )
            if org.contacts:
                report.status = "PASS"
                report.status_extended = (
                    f"Organization {org.name} has essential contacts configured."
                )
            findings.append(report)

        return findings
