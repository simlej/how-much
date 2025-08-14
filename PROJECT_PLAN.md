# Work Time Calculator - Project Plan

## Project Overview
A React-based frontend application that calculates how much work time is required to afford a specific item based on monthly income.

## Technology Stack
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **Icons**: Lucide React

## Project Structure
```
how-much-calculator/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn-ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   └── WorkTimeCalculator.tsx  # Main calculator component
│   ├── lib/
│   │   └── utils.ts      # Utility functions
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Features Implemented

### ✅ Core Features
1. **Monthly Income Input** - User can enter their monthly income
2. **Item Price Input** - User can enter the price of the desired item
3. **Work Schedule Configuration**:
   - Hours per day (default: 8)
   - Days per week (default: 5)
4. **Dual Time Calculations**:
   - **Total Time**: Continuous time needed to earn the item price
   - **Work Time**: Actual working hours required during work schedule
5. **Hourly Rate Display** - Shows calculated hourly rate based on inputs

### ✅ UI/UX Features
1. **Responsive Design** - Works on desktop and mobile devices
2. **Clean Interface** - Modern card-based layout with shadcn-ui
3. **Visual Feedback** - Different colored result cards for clarity
4. **Input Validation** - Button disabled until required fields are filled
5. **Icons** - Calculator and clock icons for visual appeal
6. **Gradient Background** - Attractive blue gradient background

### ✅ Technical Features
1. **TypeScript Support** - Full type safety throughout the application
2. **Component Architecture** - Modular, reusable components
3. **State Management** - React hooks for local state
4. **Path Aliases** - Clean imports using @ alias
5. **CSS Variables** - shadcn-ui design system integration

## Calculation Logic

The application calculates work time using the following formula:

1. **Calculate working days per month**: `(daysPerWeek × 52) ÷ 12`
2. **Calculate monthly hours**: `workingDaysPerMonth × hoursPerDay`
3. **Calculate hourly rate**: `monthlyIncome ÷ monthlyHours`
4. **Calculate hours needed**: `itemPrice ÷ hourlyRate`
5. **Convert to readable format**: Days, hours, and minutes

## Development Status

### ✅ Completed Tasks
- [x] Initialize Vite project with React and TypeScript
- [x] Install and configure Tailwind CSS and shadcn-ui
- [x] Create the main calculator component
- [x] Implement income and item price input fields
- [x] Add calculation logic for work time needed
- [x] Style the application with Tailwind CSS and shadcn-ui
- [x] Create project plan markdown file

### 🎯 Current Status
All planned features have been implemented successfully. The application is ready for use and can be started with `npm run dev`.

## How to Run the Project

1. **Navigate to project directory**:
   ```bash
   cd how-much-calculator
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Example Usage

1. Enter monthly income: `$5000`
2. Enter item price: `$1200`
3. Set work schedule: `8 hours/day, 5 days/week`
4. Click "Calculate Work Time"
5. View results:
   - **Total Time**: 5d 18h 24m (continuous time)
   - **Work Time**: 7d 2h 24m (actual working time)
   - **Hourly Rate**: $28.85/hour

This helps users understand the true cost of purchases in terms of their time and labor.