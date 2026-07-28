import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './App.css';

// ==========================================
// 🛡️ ZOD SCHEMA
// ==========================================
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Email must contain an '@' symbol"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function App() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==========================================
  // ⚡ REACT HOOK FORM SETUP
  // ==========================================
  const { 
    register, 
    handleSubmit, 
    trigger, 
    watch, 
    reset, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '', lastName: '', dob: '', email: '', password: '', confirmPassword: ''
    }
  });

  const formValues = watch();

  const onFinalSubmit = (data) => {
    console.log("🚀 Enterprise Payload: ", data);
    setIsSubmitted(true);
  };

  const handleNext = async () => {
    const fieldsToValidate = step === 1 
      ? ['firstName', 'lastName', 'dob'] 
      : ['email', 'password', 'confirmPassword'];
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleReset = () => {
    reset(); 
    setStep(1); 
    setIsSubmitted(false); 
  };

  // ==========================================
  // 🎉 SUCCESS SCREEN
  // ==========================================
  if (isSubmitted) {
    return (
      <div className="wizard-container success-container">
        <div className="success-icon-wrapper">
           <span className="success-icon">✓</span>
        </div>
        <h2>Registration Successful!</h2>
        <p className="success-subtext">Your account has been created successfully. All payload data has been logged to the console.</p>
        <button type="button" className="start-new-btn" onClick={handleReset}>
          Start New Registration
        </button>
      </div>
    );
  }

  const isStepOneValid = formValues.firstName && formValues.lastName && formValues.dob && !errors.firstName && !errors.lastName && !errors.dob;
  const isStepTwoValid = formValues.email && formValues.password && formValues.confirmPassword && !errors.email && !errors.password && !errors.confirmPassword && (formValues.password === formValues.confirmPassword);

  return (
    <div className="wizard-container">
      
      {/* 🔹 MAIN HEADING */}
      <h1 className="main-title">The Registration Wizard</h1>

      {/* 🔹 STEPPER HEADER */}
      <div className="stepper-header">
        <p className="step-title">STEP {step} OF 3</p>
        <div className="stepper-icons">
          <div className={`step-circle ${step > 1 ? 'completed' : 'active'}`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <div className="step-line"></div>
          <div className={`step-circle ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            2
          </div>
          <div className="step-line"></div>
          <div className={`step-circle ${step === 3 ? 'active' : ''}`}>
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFinalSubmit)}>
        
        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div className="form-step fade-in">
            <h2>Step 1: Personal Info</h2>
            <p className="sub-heading">Tell us a bit about yourself.</p>

            <div className="input-group">
              <label>First Name</label>
              <input type="text" placeholder="Enter first name" {...register('firstName')} />
              {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
            </div>
            
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" placeholder="Enter last name" {...register('lastName')} />
              {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
            </div>

            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" {...register('dob')} />
              {errors.dob && <span className="error-text">{errors.dob.message}</span>}
            </div>

            <div className="button-group right-align">
              <button 
                type="button" 
                onClick={handleNext} 
                disabled={!isStepOneValid}
                className={`next-btn ${!isStepOneValid ? 'disabled-btn' : ''}`}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div className="form-step fade-in">
            <h2>Step 2: Account Details</h2>
            <p className="sub-heading">Set up your login credentials.</p>
            
            <div className="input-group">
              <label>Work Email</label>
              <input type="email" placeholder="example@email.com" {...register('email')} />
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Min 8 characters" 
                  {...register('password')} 
                />
                <button type="button" className="toggle-btn" onClick={togglePassword} title="Toggle Password">
                  {showPassword ? "🙈" : "👁️"} 
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Re-enter password" 
                  {...register('confirmPassword')} 
                />
                <button type="button" className="toggle-btn" onClick={togglePassword}>
                   {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
            </div>

            <div className="button-group space-between">
              <button type="button" className="back-btn" onClick={handleBack}>← Back</button>
              <button 
                type="button" 
                onClick={handleNext} 
                disabled={!isStepTwoValid}
                className={`next-btn ${!isStepTwoValid ? 'disabled-btn' : ''}`}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="form-step fade-in">
            <h2>Step 3: Review & Submit</h2>
            <p className="sub-heading">Please verify your information.</p>
            
            <div className="summary-box">
              <p><strong>Name:</strong> {formValues.firstName} {formValues.lastName}</p>
              <p><strong>DOB:</strong> {formValues.dob}</p>
              <p><strong>Email:</strong> {formValues.email}</p>
              <p><strong>Password:</strong> {formValues.password ? '********' : 'Not Set'}</p>
            </div>
            
            <div className="button-group space-between">
              <button type="button" className="back-btn" onClick={handleBack}>← Back</button>
              <button type="submit" className="submit-btn">Submit</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;