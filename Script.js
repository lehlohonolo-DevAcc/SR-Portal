// script.js
document.addEventListener('DOMContentLoaded', function() {
    // =====================
    // Entra ID Configuration
    // =====================
    const msalConfig = {
        auth: {
            clientId: "a823ea10-fdd8-4b07-9399-b673839b57e0", //  Entra ID app client ID
            authority: "https://login.microsoftonline.com/8fb179f2-b299-4226-b6ba-b625ed97a18b", // Replace with your tenant ID
            redirectUri: "http://localhost:5500" // Should match app registration
        },
        cache: {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: false
        }
    };

    const msalInstance = new msal.PublicClientApplication(msalConfig);
    const loginRequest = { scopes: ["User.Read"] };

    // =====================
    // Authentication Management
    // =====================
    async function initializeAuth() {
        try {
            const response = await msalInstance.handleRedirectPromise();
            if (response) {
                handleLoginSuccess(response.account);
            } else {
                const accounts = msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    handleLoginSuccess(accounts[0]);
                } else {
                    showAuthPrompt();
                }
            }
        } catch (error) {
            console.error("Authentication error:", error);
            alert("Authentication failed. Please try again.");
        }
    }

    function handleLoginSuccess(account) {
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('welcomeMessage').textContent = `Welcome, ${account.name}`;
        document.getElementById('welcomeMessage').style.display = 'block';
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('authMessage').style.display = 'none';
    }

    function showAuthPrompt() {
        document.getElementById('authMessage').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
    }

    // =====================
    // Form Handling
    // =====================
    const form = document.getElementById('serviceRequestForm');
    
    function showSuccessModal() {
        document.getElementById('successModal').style.display = 'flex';
        form.reset();
    }

    function closeSuccessModal() {
        document.getElementById('successModal').style.display = 'none';
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            // Check authentication status
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length === 0) {
                alert("Please sign in first!");
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // Get user details from Entra ID
            const user = accounts[0];
            const caseData = {
                title: document.getElementById('issueType').value,
                description: document.getElementById('caseDescription').value,
                userEmail: user.username,
                userName: user.name,
                submissionDate: new Date().toISOString()
            };

            // Simulated submission (replace with actual API call)
            setTimeout(() => {
                console.log("Case submitted:", caseData);
                showSuccessModal();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Request';
            }, 1000);

        } catch (error) {
            console.error('Submission error:', error);
            alert('Submission failed. Please try again.');
        }
    });

    // =====================
    // Event Listeners
    // =====================
    document.getElementById('loginButton').addEventListener('click', () => {
        msalInstance.loginRedirect(loginRequest);
    });

    window.closeSuccessModal = closeSuccessModal;
    
    // Initialize authentication on page load
    initializeAuth();
});