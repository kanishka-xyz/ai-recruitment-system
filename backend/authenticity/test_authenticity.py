import os
import tempfile
import unittest

from .timeline import analyze_employment_timeline
from .utils import calculate_sha256, extract_candidate_urls, normalize_text, redact_pii


class AuthenticityTests(unittest.TestCase):

    def test_timeline_detects_overlap(self):
        resume = {"total_experience_years": 3}
        text = """
        Software Engineer at Alpha
        Jan 2022 - Dec 2023

        Consultant at Beta
        Jun 2023 - Present
        """
        result = analyze_employment_timeline(resume, text)
        self.assertEqual(result["checks"]["periods_detected"], 2)
        self.assertEqual(result["checks"]["overlap_count"], 1)
        self.assertEqual(result["status"], "Potentially Inconsistent")

    def test_redaction_and_normalization(self):
        text = "Jane.Doe@example.com +91 98765 43210"
        self.assertIn("[EMAIL]", redact_pii(text))
        self.assertIn("[PHONE]", redact_pii(text))
        self.assertEqual(normalize_text("React, Python!"), "react python")

    def test_url_extraction(self):
        urls = extract_candidate_urls(
            "GitHub: https://github.com/example/project",
            {"portfolio_url": "https://example.dev"},
        )
        self.assertIn("https://github.com/example/project", urls)
        self.assertIn("https://example.dev", urls)

    def test_sha256_changes_with_content(self):
        with tempfile.NamedTemporaryFile(delete=False) as handle:
            path = handle.name
            handle.write(b"resume-one")
        try:
            first = calculate_sha256(path)
            with open(path, "wb") as handle:
                handle.write(b"resume-two")
            second = calculate_sha256(path)
            self.assertNotEqual(first, second)
        finally:
            os.remove(path)


if __name__ == "__main__":
    unittest.main()
