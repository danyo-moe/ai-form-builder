import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicForm } from './components/dynamic-form/dynamic-form';
import { FormBuilder } from './components/form-builder/form-builder';
import { FormConfig } from './models/form-config.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DynamicForm, FormBuilder],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Current view: 'builder' or 'preview'
  currentView = signal<'builder' | 'preview'>('builder');

  // Current theme
  currentTheme = signal<'minimal' | 'modern' | 'classic'>('modern');

  // Current form configuration
  currentConfig = signal<FormConfig | null>(null);

  // Submission result
  submissionResult = signal<string>('');

  // Available themes
  themes = [
    { id: 'minimal' as const, name: 'Minimal', description: 'Clean and simple' },
    { id: 'modern' as const, name: 'Modern', description: 'Vibrant and rounded' },
    { id: 'classic' as const, name: 'Classic', description: 'Traditional serif' },
  ];

  onConfigChanged(config: FormConfig): void {
    this.currentConfig.set(config);
  }

  switchTheme(theme: 'minimal' | 'modern' | 'classic'): void {
    this.currentTheme.set(theme);
  }

  switchView(view: 'builder' | 'preview'): void {
    this.currentView.set(view);
  }

  onFormSubmit(data: { [key: string]: any }): void {
    console.log('Form submitted:', data);
    this.submissionResult.set(`Form submitted successfully! Data: ${JSON.stringify(data, null, 2)}`);

    setTimeout(() => {
      this.submissionResult.set('');
    }, 5000);
  }

  onFormSave(data: { [key: string]: any }): void {
    console.log('Form saved:', data);
  }

  onValidationErrors(errors: any[]): void {
    console.log('Validation errors:', errors);
  }
}
