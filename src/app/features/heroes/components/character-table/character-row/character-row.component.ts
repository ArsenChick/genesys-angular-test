import { ChangeDetectionStrategy, Component, EventEmitter, Host, HostBinding, HostListener, Input, Output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { ICharacter } from "../../../../../features/heroes/interfaces/character.interface";

@Component({
  selector: '[app-character-row]',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './character-row.component.html',
  styleUrl: './character-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterRowComponent {
  @Input() characterRow?: ICharacter;
  @Output() nameClick = new EventEmitter<number>();

  // Adding accessibility attribute values onto the component host
  @HostBinding('attr.role')
  private readonly _role = 'link';
  @HostBinding('attr.tabindex')
  private readonly _tabindex = '0';
  @HostBinding('attr.ariaLabel')
  private get _ariaLabel() {
    return `View details for ${this.characterRow?.name}`;
  }

  @HostListener('click')
  onClick() {
    if (this.characterRow)
      this.nameClick.emit(this.characterRow.id);
  }
}
