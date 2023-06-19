# Command Store

![demo](https://user-images.githubusercontent.com/24281652/152735693-c943bccd-6345-4e07-b78e-380410e28b22.gif)

A visual studio code extension where you can store your command lines and run them from sidebar

## Release Notes

### 1.0.0

Initial release

### 1.1.0

Add configurable save location for command-lines config

1. Go to File>Preference>Setting or `Ctrl + ,`
2. Go to Extensions>Command Store>Config Saving Location
   ![demo-setting](https://github.com/ardisaurus/command-store/assets/24281652/9e9c06a2-e299-4be2-8e91-a139adc53483)

Available options:

- root : Save config in your root project folder.
- workspace : Save config as workspace setting inside your .vscode folder. Make sure to open/view a file inside your project folder before make a new command item.
- application : Save config as user setting, to use across diferent projects.
