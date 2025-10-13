import React from 'react'

const IngredientCheckbox = ({ 
  ingredient, 
  isChecked, 
  onToggle, 
  disabled = false 
}) => {
  return (
    <div className="ingredient-checkbox-wrapper">
      <input
        type="checkbox"
        id={`checkbox-${ingredient}`}
        checked={isChecked}
        onChange={() => onToggle(ingredient)}
        disabled={disabled}
        className="ingredient-checkbox-input"
      />
      <label 
        htmlFor={`checkbox-${ingredient}`}
        className="ingredient-checkbox-label"
      >
        <span className="checkbox-visual">
          {isChecked ? '✓' : ''}
        </span>
      </label>
    </div>
  )
}

export default IngredientCheckbox
