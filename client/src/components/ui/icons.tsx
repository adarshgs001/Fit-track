import React from 'react';
import { LucideProps } from 'lucide-react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Circle,
  Clock,
  Filter,
  Flame,
  Home,
  PlusCircle,
  Search,
  Settings,
  User,
  X,
  Menu,
  ChevronDown,
  Plus,
  Calendar,
  Dumbbell,
  Utensils,
  BarChart,
  Heart,
  Droplet,
  Activity,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Info,
  Edit,
  Trash,
  Star,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Egg
} from 'lucide-react';

export type IconProps = LucideProps;

// Basic UI Icons
export const CloseIcon = X;
export const CheckIcon = Check;
export const HomeIcon = Home;
export const SearchIcon = Search;
export const FilterIcon = Filter;
export const ChevronsUpDownIcon = ChevronsUpDown;
export const CircleIcon = Circle;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const ChevronDownIcon = ChevronDown;
export const MenuIcon = Menu;
export const PlusIcon = Plus;
export const ArrowRightIcon = ArrowRight;
export const ArrowLeftIcon = ArrowLeft;
export const ArrowUpIcon = ArrowUp;
export const InfoIcon = Info;
export const AlertIcon = AlertCircle;
export const CheckCircleIcon = CheckCircle2;

// Fitness Related Icons
export const DumbbellIcon = Dumbbell;
export const ExerciseIcon = Dumbbell; // Alias for ExerciseIcon
export const WorkoutIcon = Dumbbell; // Alias for WorkoutIcon
export const ActivityIcon = Activity;
export const HeartIcon = Heart;
export const TrophyIcon = Trophy;
export const MedalIcon = Trophy; // Alias for MedalIcon
export const RunIcon = Activity; // Alias for RunIcon

// Food Related Icons
export const DietIcon = Utensils;
export const WaterDropIcon = Droplet;
export const FoodIcon = Utensils;
export const FireIcon = Flame;
export const ClockIcon = Clock;
export const CalendarIcon = Calendar;

// Nutrient Icons
export const ProteinIcon = (props: IconProps) => (
  <Egg {...props} />
);

export const CarbsIcon = (props: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M5 5.5C5 4.12 6.12 3 7.5 3s2.5 1.12 2.5 2.5v13C10 19.88 8.88 21 7.5 21S5 19.88 5 18.5v-13z" />
    <path d="M17.5 9.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5h-9C7.12 14.5 6 13.38 6 12s1.12-2.5 2.5-2.5h9z" />
  </svg>
);

export const FatIcon = (props: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M14 10c3.866 0 7-1.79 7-4s-3.134-4-7-4-7 1.79-7 4c0 1.552 1.804 2.887 4.5 3.548" />
    <path d="M4 16.5c0 2.21 3.134 4 7 4s7-1.79 7-4c0-1.552-1.804-2.887-4.5-3.548" />
    <path d="M11 12.452c-2.699-.661-4.5-1.996-4.5-3.548v7.5" />
  </svg>
);

// UI Specific Icons
export const SettingsIcon = Settings;
export const UserIcon = User;
export const PlusCircleIcon = PlusCircle;
export const ChartIcon = BarChart;
export const EditIcon = Edit;
export const TrashIcon = Trash;
export const MoreIcon = ChevronsUpDown;
export const StarIcon = Star;

// Custom Icons
export const TimerIcon = (props: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const DashboardIcon = (props: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

export const ProgressIcon = (props: IconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);