# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - generic [ref=e5]:
      - img "dot.pe" [ref=e6]
      - paragraph [ref=e7]: Cash access, reimagined.
    - generic [ref=e8]:
      - generic [ref=e9]:
        - heading "Let's get started!" [level=2] [ref=e10]
        - paragraph [ref=e11]: We'll send a one-time code for instant access.
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e15]: "+91"
          - textbox "Enter your mobile number" [ref=e16]: "9999999999"
        - paragraph [ref=e17]: For security purposes, you can only request this after 1 seconds.
      - button "Request OTP" [ref=e19] [cursor=pointer]
      - generic [ref=e22]: or
      - generic [ref=e24]:
        - button "Continue with Google" [ref=e25] [cursor=pointer]
        - button "Continue with Apple" [ref=e26] [cursor=pointer]
        - button "Continue with X" [ref=e27] [cursor=pointer]
      - paragraph [ref=e28]:
        - text: By continuing, you agree to Dot.Pe's
        - link "Terms & Conditions" [ref=e29] [cursor=pointer]:
          - /url: "#"
        - text: and
        - link "Privacy Policy" [ref=e30] [cursor=pointer]:
          - /url: "#"
```