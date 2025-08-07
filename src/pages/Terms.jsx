import React from "react";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

const TermsPage = () => {
    return (
        <>
            <Navigation />
            <div className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose dark:prose-invert prose-lg">
                        <h1 className="text-3xl font-bold mb-8">Disclaimer and Terms of Use for Synapaxon</h1>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">LEGAL DISCLAIMER</h2>

                        <h3 className="text-xl font-medium mt-6 mb-2">1.1. No Medical or Professional Advice</h3>
                        <p>
                            The content provided on this website, synapaxon.com (hereinafter "Platform"), including but not limited to questions, answers, explanations, PDF documents, videos, and any other materials uploaded by users or provided by the Platform, is for informational and educational purposes only. It is not intended to be a substitute for real exam assessments, professional medical advice, diagnosis, treatment, or legal, financial, or other professional advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or accessed on this Platform.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">1.2. For Educational and Preparatory Use Only</h3>
                        <p>
                            This Platform is designed to assist students in their preparation for medical education courses. However, use of this Platform does not guarantee success on the USMLE or any other examination. Individual results will vary.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">1.3. No Endorsement or Affiliation</h3>
                        <p>
                            Synapaxon is an independent entity and is not affiliated with, endorsed by, or sponsored by the National Board of Medical Examiners (NBME®), the Federation of State Medical Boards (FSMB®), the Educational Commission for Foreign Medical Graduates (ECFMG®), or any other official USMLE-governing body or any national or international medical board exams. USMLE® is a joint program of the NBME and FSMB. All trademarks are the property of their respective owners.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">1.4. Accuracy and Completeness of Information</h3>
                        <p>
                            While we strive to maintain a high standard of quality, much of the content on this Platform is user-generated. We do not make any representations or warranties, express or implied, regarding the accuracy, completeness, reliability, or suitability of any information or materials found on or uploaded to the Platform. Users are solely responsible for the content they upload and for verifying the accuracy and appropriateness of any information before relying on it. We disclaim all liability for any errors or omissions in the content.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">1.5. User Responsibility</h3>
                        <p>
                            You are solely responsible for the content you upload, including its legality, reliability, accuracy, and appropriateness. You warrant that you have all necessary rights, licenses, and permissions to upload and share such content and that your content does not infringe upon the intellectual property rights or other rights of any third party.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">1.6. Limitation of Liability</h3>
                        <p>
                            To the fullest extent permitted by applicable law, Synapaxon (hereinafter "We," "Us," "Our") shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Platform; (b) any conduct or content of any third party on the Platform, including without limitation, any defamatory, offensive, or illegal conduct of other users or third parties; (c) any content obtained from the Platform; or (d) unauthorized access, use, or alteration of your transmissions or content.
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">TERMS OF USE</h2>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.1. Acceptance of Terms</h3>
                        <p>
                            By accessing or using our Platform, you agree to be bound by these Terms of Use ("Terms") and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Platform.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.2. Eligibility</h3>
                        <p>
                            You must be at least 18 years old or the age of majority in your jurisdiction to use this Platform. By using the Platform, you represent and warrant that you meet these eligibility requirements.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.3. User Accounts</h3>
                        <ul className="list-disc pl-6">
                            <li className="mb-2">
                                <strong>Registration:</strong> To access certain features, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                            </li>
                            <li className="mb-2">
                                <strong>Account Security:</strong> You are responsible for safeguarding your account password and for any activities or actions under your account. You agree to notify us immediately of any unauthorized use of your account.
                            </li>
                            <li className="mb-2">
                                <strong>Account Termination:</strong> We reserve the right to suspend or terminate your account at our sole discretion, without notice or liability, for any reason, including but not limited to a breach of these Terms.
                            </li>
                        </ul>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.4. User-Generated Content</h3>
                        <ul className="list-disc pl-6">
                            <li className="mb-2">
                                <strong>Ownership:</strong> You retain ownership of any intellectual property rights that you hold in the content you upload to the Platform.
                            </li>
                            <li className="mb-2">
                                <strong>License to Us:</strong> By uploading content, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with operating and providing the Platform and its services to you and other users. This license is for the limited purpose of operating, promoting, and improving our services, and to develop new ones. This license continues even if you stop using our Platform with respect to content you have already shared, unless you specifically request its deletion and such deletion is technically feasible.
                            </li>
                            <li className="mb-2">
                                <strong>Responsibility:</strong> You are solely responsible for your content and the consequences of posting or publishing it. You affirm, represent, and warrant that you own or have the necessary licenses, rights, consents, and permissions to publish the content you submit.
                            </li>
                            <li className="mb-2">
                                <strong>Prohibited Content:</strong> You agree not to upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable; infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party; contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware or telecommunications equipment; constitutes unsolicited or unauthorized advertising, promotional materials, "junk mail," "spam," "chain letters," "pyramid schemes," or any other form of solicitation; or violates any applicable local, state, national, or international law.
                            </li>
                        </ul>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.5. Platform Use Restrictions</h3>
                        <p>
                            You agree not to use the Platform for any illegal purpose or in violation of any local, state, national, or international law; reverse engineer, decompile, disassemble, or otherwise attempt to discover the source code of the Platform; modify, adapt, translate, or create derivative works based upon the Platform; interfere with or disrupt the operation of the Platform or the servers or networks used to make the Platform available; or attempt to gain unauthorized access to the Platform.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.6. Intellectual Property of the Platform</h3>
                        <p>
                            All rights, title, and interest in and to the Platform (excluding user-generated content), including its "look and feel," features, and functionality, are and will remain the exclusive property of Synapaxon and its licensors. The Platform is protected by copyright, trademark, and other laws of the United States and foreign countries.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.7. Content Moderation</h3>
                        <p>
                            We reserve the right, but are not obligated, to monitor, review, screen, or remove any user-generated content at our sole discretion and without notice, for any reason, including if we believe that such content violates these Terms or is otherwise objectionable.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.8. Disclaimers</h3>
                        <p>
                            THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. USE OF THE PLATFORM IS AT YOUR OWN RISK. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM IS PROVIDED WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.9. Limitation of Liability</h3>
                        <p>
                            (Refer to Section 1.6 of the Legal Disclaimer)
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.10. Indemnification</h3>
                        <p>
                            You agree to defend, indemnify, and hold harmless Synapaxon and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Platform, by you or any person using your account and password; b) a breach of these Terms, or c) content posted on the Platform.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.11. Termination</h3>
                        <p>
                            We may terminate or suspend your access to our Platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Platform will immediately cease.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.12. Governing Law</h3>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.13. Changes to Terms</h3>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Platform after those revisions become effective, you agree to be bound by the revised terms.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">2.14. Contact Information</h3>
                        <p>
                            If you have any questions about these Terms, please contact us at [Your Email Address or Contact Form Link].
                        </p>

                        <h2 className="text-2xl font-semibold mt-8 mb-4">MONETARY POLICY</h2>

                        <h3 className="text-xl font-medium mt-6 mb-2">3.1. General</h3>
                        <p>
                            This Monetary Policy outlines the terms related to payments, subscriptions, and refunds (if applicable) for services offered on the Platform.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">3.2. Free and Paid Services</h3>
                        <ul className="list-disc pl-6">
                            <li className="mb-2">
                                <strong>Free Tier:</strong> The Platform may offer a free tier of service with limited features or usage.
                            </li>
                            <li className="mb-2">
                                <strong>Paid Subscriptions/Services:</strong> We may offer premium features through paid subscriptions ("Subscriptions") or one-time purchases ("Purchases"). Details of current Subscriptions, Purchases, and their respective fees will be available on the Platform.
                            </li>
                        </ul>

                        <h3 className="text-xl font-medium mt-6 mb-2">3.3. Payment Terms</h3>
                        <ul className="list-disc pl-6">
                            <li className="mb-2">
                                All fees are quoted in U.S. Dollars unless otherwise specified.
                            </li>
                            <li className="mb-2">
                                You agree to pay all applicable fees for Subscriptions or Purchases you select.
                            </li>
                            <li className="mb-2">
                                We may use a third-party payment processor to bill you through a payment account linked to your account on the Platform. The processing of payments will be subject to the terms, conditions, and privacy policies of the payment processor in addition to these Terms. We are not responsible for errors by the payment processor.
                            </li>
                        </ul>

                        <h3 className="text-xl font-medium mt-6 mb-2">3.4. Subscriptions (if applicable)</h3>
                        <ul className="list-disc pl-6">
                            <li className="mb-2">
                                <strong>Billing Cycle:</strong> Subscription fees may be billed on a recurring basis (e.g., monthly, annually) as specified at the time of purchase.
                            </li>
                            <li className="mb-2">
                                <strong>Automatic Renewal:</strong> Unless you cancel your Subscription before the end of the current billing period, your Subscription will automatically renew, and you authorize us (without notice to you, unless required by applicable law) to collect the then-applicable Subscription fee and any taxes, using any payment method we have on record for you.
                            </li>
                            <li className="mb-2">
                                <strong>Cancellation:</strong> You may cancel your Subscription at any time through your account settings or by contacting us. Cancellation will take effect at the end of the current billing period, and you will continue to have access to the Subscription benefits until then.
                            </li>
                        </ul>

                        <h3 className="text-xl font-medium mt-6 mb-2">3.5. Refund Policy</h3>
                        <ul className="list-disc pl-6">
                            <li className="mb-2">
                                <strong>General:</strong> Except when required by law, all fees for Subscriptions and Purchases are non-refundable.
                            </li>
                            <li className="mb-2">
                                <strong>Exceptional Circumstances:</strong> We may, at our sole discretion, consider refund requests on a case-by-case basis.
                            </li>
                            <li className="mb-2">
                                <strong>This refund policy does not affect any statutory rights that may apply.</strong>
                            </li>
                        </ul>

                        <h3 className="text-xl font-medium mt-6 mb-2">3.6. Price Changes</h3>
                        <p>
                            We reserve the right to change the fees for Subscriptions or Purchases at any time. We will provide you with reasonable prior notice of any price changes. If you do not agree to the price change, you must cancel your Subscription before the change takes effect. Your continued use of the Subscription after the price change comes into effect constitutes your agreement to pay the modified Subscription fee.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">3.7. Taxes</h3>
                        <p>
                            You are responsible for paying all applicable taxes, duties, and other governmental assessments associated with your Subscriptions or Purchases.
                        </p>

                        <h3 className="text-xl font-medium mt-6 mb-2">3.8. Promotional Offers</h3>
                        <p>
                            We may, from time to time, offer promotional codes or discounts. Such offers are subject to their specific terms and conditions and may not be combined with other offers unless explicitly stated.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsPage;