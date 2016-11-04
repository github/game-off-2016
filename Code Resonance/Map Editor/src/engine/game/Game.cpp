#include "engine\game\Game.h"

#include "engine\gfx\font\Font.h"

#include <functional>
#include <iostream>

bool Game::init()
{
	m_cPauseScreen = -1;

	Font::getInstance().setFont("Fontsheet.png");
	Globals::getInstance().m_zoom = 1;

	m_zoneMap = new ZoneMap();

	m_zoom = 1;
	m_camPos = Vector2<Sint32>(0, 0);

	m_backTexId = MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Background.png"));

	resize();

	m_guiAll = new Container("CONTAINER_ALL", Globals::getInstance().m_screenSize / -2, Globals::getInstance().m_screenSize, true);
	m_guiPause = new Container("CONTAINER_PAUSE", {0, 0}, Globals::getInstance().m_screenSize, false);
	m_guiTop = new Container("CONTAINER_TOP", {0, 0}, {Globals::getInstance().m_screenSize.x, 32}, true);
	m_guiLeft = new ContainerPanel("CONTAINER_LEFT", "Layers", {16, 64}, {266, 149}, 0, true, LTexture::getInstance().loadImage("gui\\BarFlatRound.png"), COMPONENT_TEXTURE_STYLE_SCALE);
	m_guiRight = new ContainerPanel("CONTAINER_RIGHT", "Pallet", {16, 32}, {288, 640}, 0, true, LTexture::getInstance().loadImage("gui\\BarFlatRound.png"), COMPONENT_TEXTURE_STYLE_SCALE);

	m_guiAll->addComponent(m_guiPause, PANEL_ALIGN_TOP_LEFT)->setPriorityLayer(5);
	m_guiPause->addComponent(new Panel("PANEL_BG", "", {0, 0}, Globals::getInstance().m_screenSize, 4, true), PANEL_ALIGN_CENTER);
	m_guiAll->addComponent(m_guiLeft, PANEL_ALIGN_TOP_LEFT);
	m_guiAll->addComponent(m_guiRight, PANEL_ALIGN_TOP_RIGHT);
	m_guiAll->addComponent(m_guiTop, PANEL_ALIGN_TOP_LEFT)->setPriorityLayer(4);




	m_toolbarMenu = new CToolbar("TOOLBAR_MENU", {0, 0}, {Globals::getInstance().m_screenSize.x, 24}, 0);
	m_toolbarMenu->addButton("", "File");
	{
		m_toolbarMenu->addButton("File", "Save", []() {
			Game::getInstance().m_guiSaveMap->setVisible(true);
			Game::getInstance().m_guiPause->setVisible(true);
			Game::getInstance().pause("CONTAINER_SAVE_MAP");
		});
		m_toolbarMenu->addButton("File", "Load", []() {
			Game::getInstance().m_guiLoadMap->setVisible(true);
			Game::getInstance().m_guiPause->setVisible(true);
			Game::getInstance().pause("CONTAINER_LOAD_MAP");
		});
		m_toolbarMenu->addButton("File", "New", []() {
			Game::getInstance().m_guiClearMap->setVisible(true);
			Game::getInstance().m_guiPause->setVisible(true);
			Game::getInstance().pause("CONTAINER_CLEAR_MAP");
		});
		m_toolbarMenu->addButton("File", "Exit", []() {
			Globals::getInstance().m_exitting = 1;
			Game::getInstance().pause("CONTAINER_EXIT");
		});
	}
	m_toolbarMenu->addButton("", "Edit");
	{
		m_toolbarMenu->addButton("Edit", "Resize", []() {
			Game::getInstance().m_guiResizeMap->findComponent("SLIDER_WIDTH")->setValue(Game::getInstance().m_zoneMap->getSize().x);
			Game::getInstance().m_guiResizeMap->findComponent("SLIDER_HEIGHT")->setValue(Game::getInstance().m_zoneMap->getSize().y);
			Game::getInstance().pause("CONTAINER_RESIZE_MAP");
		});
	}
	m_toolbarMenu->addButton("", "View");
	{
		m_toolbarMenu->addButton("View", "Toggle Grid", []() {
			Game::getInstance().m_showGrid = !Game::getInstance().m_showGrid;
		});
		m_toolbarMenu->addButton("View", "Toggle Overlay", []() {
			Game::getInstance().m_guiLeft->setVisible(!Game::getInstance().m_guiLeft->isVisible());
			Game::getInstance().m_guiRight->setVisible(!Game::getInstance().m_guiRight->isVisible());
		});
	}
	m_toolbarMenu->addButton("", "Help");
	{
		m_toolbarMenu->addButton("Help", "Nothing yet!");
	}
	m_guiTop->addComponent(m_toolbarMenu);



	m_selectLayer = new CButtonRadio("RADIO_LAYER", "Layer", {0, 24}, {264, 200}, 1);
	m_selectLayer->addButton(new CButtonToggle("RBUTTON_GROUND", "Ground", {0, 0}, {264, 24}, 16, 1));
	m_selectLayer->addButton(new CButtonToggle("RBUTTON_WORLD", "World", {0, 25}, {264, 24}, 16, 1));
	m_selectLayer->addButton(new CButtonToggle("RBUTTON_SKY", "Sky", {0, 50}, {264, 24}, 16, 1));
	m_selectLayer->addButton(new CButtonToggle("RBUTTON_STAMPS", "Stamps", {0, 75}, {264, 24}, 16, 1));
	m_guiLeft->addComponent(m_selectLayer, PANEL_ALIGN_TOP);

	m_guiLeft->addComponent(new CButtonToggle("BUTTON_GROUND_VISIBLE", "", MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Visible.png")),
		MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Invisible.png")), {-120, 24}, {24, 24}, 16, 1, 1), PANEL_ALIGN_TOP);
	m_guiLeft->addComponent(new CButtonToggle("BUTTON_WORLD_VISIBLE", "", MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Visible.png")),
		MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Invisible.png")), {-120, 49}, {24, 24}, 16, 1, 1), PANEL_ALIGN_TOP);
	m_guiLeft->addComponent(new CButtonToggle("BUTTON_SKY_VISIBLE", "", MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Visible.png")),
		MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Invisible.png")), {-120, 74}, {24, 24}, 16, 1, 1), PANEL_ALIGN_TOP);



	m_guiRightGround = new Container("CONTAINER_RIGHT_GROUND", {0, 0}, {288, 640}, true);
	m_guiRightWorld = new Container("CONTAINER_RIGHT_WORLD", {0, 0}, {288, 640}, false);
	m_guiRightSky = new Container("CONTAINER_RIGHT_SKY", {0, 0}, {288, 640}, false);
	m_guiRightStamp = new Container("CONTAINER_RIGHT_STAMP", {0, 0}, {288, 640}, false);

	m_guiRight->addComponent(m_guiRightGround);
	m_guiRight->addComponent(m_guiRightWorld);
	m_guiRight->addComponent(m_guiRightSky);
	m_guiRight->addComponent(m_guiRightStamp);

	m_guiRightWorldSwitch = new Container("CONTAINER_RIGHT_WORLD_SWITCH", {0, 0}, {288, Globals::getInstance().m_screenSize.y}, false);
	m_guiRightWorldPortal = new Container("CONTAINER_RIGHT_WORLD_PORTAL", {0, 0}, {288, Globals::getInstance().m_screenSize.y}, false);

	m_guiRightWorld->addComponent(m_guiRightWorldSwitch);
	m_guiRightWorld->addComponent(m_guiRightWorldPortal);



	//m_guiRightGround->addComponent(new TextField("TEXTFIELD_STAMP_NAME", "Stamp1", Vector2<Sint32>(16, 324), Vector2<Sint32>(16, 1), 16, 1));

	m_guiRightWorld->addComponent(new TextField("TEXTFIELD_OBJECT_NAME", "Object Name", Vector2<Sint32>(16, 204), Vector2<Sint32>(16, 1), 16, 1));

	m_guiRightWorldPortal->addComponent(new TextField("TEXTFIELD_PORTAL", "Destination Zone", {8, 416}, {17, 1}, 16, 1));
	m_guiRightWorldPortal->addComponent(new CCounter("COUNTER_PORTAL_X", "X:", {0, 440}, {0, 500}, 1, 0));
	m_guiRightWorldPortal->addComponent(new CCounter("COUNTER_PORTAL_Y", "Y:", {0, 460}, {0, 500}, 1, 0));

	m_guiRightWorld->addComponent(new CDropDown("DROPDOWN_INTERACT", "Interaction Type", {0, 296}, {264, 32}, 16, 1), PANEL_ALIGN_TOP);
	m_guiRightWorld->findComponent("DROPDOWN_INTERACT")->addItem("None");
	m_guiRightWorld->findComponent("DROPDOWN_INTERACT")->addItem("Solid");
	m_guiRightWorld->findComponent("DROPDOWN_INTERACT")->addItem("Switch");
	m_guiRightWorld->findComponent("DROPDOWN_INTERACT")->addItem("Solid Switch");
	m_guiRightWorld->findComponent("DROPDOWN_INTERACT")->addItem("Portal");
	m_guiRightWorld->findComponent("DROPDOWN_INTERACT")->setPriorityLayer(5);

	m_guiRightWorldSwitch->addComponent(new CCounter("COUNTER_SWITCH_FREQUENCY", "Freq.", {0, 440}, {0, 255}, 1, 0));

	m_guiRightWorld->addComponent(new CButton("BUTTON_DELETE", "", MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Trash.png")), {0, 0}, {32, 32}, 16, 1), PANEL_ALIGN_BOTTOM_LEFT);



	m_guiRightStamp->addComponent(new TextField("TEXTFIELD_STAMP_NAME", "Stamp Name", Vector2<Sint32>(8, 20), Vector2<Sint32>(17, 1), 16, 1));

	m_guiRightStamp->addComponent(new CButtonToggle("BUTTON_USE_GROUND", "Use Ground", Vector2<Sint32>(0, 360), Vector2<Sint32>(264, 32), 16, 1), PANEL_ALIGN_TOP)->setState(1);
	m_guiRightStamp->addComponent(new CButtonToggle("BUTTON_USE_WORLD", "Use World", Vector2<Sint32>(0, 400), Vector2<Sint32>(264, 32), 16, 1), PANEL_ALIGN_TOP)->setState(1);
	m_guiRightStamp->addComponent(new CButtonToggle("BUTTON_USE_ENTITY", "Use Entity", Vector2<Sint32>(0, 440), Vector2<Sint32>(264, 32), 16, 1), PANEL_ALIGN_TOP)->setState(1);
	m_guiRightStamp->addComponent(new CButtonToggle("BUTTON_USE_SKY", "Use Sky", Vector2<Sint32>(0, 480), Vector2<Sint32>(264, 32), 16, 1), PANEL_ALIGN_TOP)->setState(1);

	m_guiRightStamp->addComponent(new CButton("BUTTON_DELETE", "", MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Trash.png")), {0, 0}, {32, 32}, 16, 1), PANEL_ALIGN_BOTTOM_LEFT);



	m_guiLeftGround = new Container("CONTAINER_LEFT_GROUND", {0, 0}, {288, Globals::getInstance().m_screenSize.y}, true);
	m_guiLeftWorld = new Container("CONTAINER_LEFT_WORLD", {0, 0}, {288, Globals::getInstance().m_screenSize.y}, false);
	m_guiLeftSky = new Container("CONTAINER_LEFT_SKY", {0, 0}, {288, Globals::getInstance().m_screenSize.y}, false);
	m_guiLeftStamp = new Container("CONTAINER_LEFT_STAMP", {0, 0}, {288, Globals::getInstance().m_screenSize.y}, false);

	m_guiLeft->addComponent(m_guiLeftGround);
	m_guiLeft->addComponent(m_guiLeftWorld);
	m_guiLeft->addComponent(m_guiLeftSky);
	m_guiLeft->addComponent(m_guiLeftStamp);



	m_guiSaveMap = new Container("CONTAINER_SAVE_MAP", {0, 0}, Globals::getInstance().m_screenSize, false);
	{
		m_guiSaveMap->addComponent(new Panel("PANEL_BG2", "Save Zone", {0, -12}, {534, 112}, 0, true), PANEL_ALIGN_CENTER);
		m_guiSaveMap->addComponent(new TextField("TEXTFIELD_WORLD_NAME", "Zone Name", {0, -24}, {32, 1}, 16, 1), PANEL_ALIGN_CENTER);
		m_guiSaveMap->addComponent(new CButton("BUTTON_SAVE", "Save", {-130, 24}, {252, 24}, 16, 1, []() {
			if(Game::getInstance().m_guiSaveMap->findComponent("TEXTFIELD_WORLD_NAME")->getTitle() != "")
			{
				Game::getInstance().m_zoneMap->save(Game::getInstance().m_guiSaveMap->findComponent("TEXTFIELD_WORLD_NAME")->getTitle());
				Game::getInstance().unpause();
				Game::getInstance().m_guiSaveMap->findComponent("BUTTON_SAVE")->setState(0);
			}
		}), PANEL_ALIGN_CENTER);
		m_guiSaveMap->addComponent(new CButton("BUTTON_CANCEL", "Cancel", {130, 24}, {252, 24}, 16, 1, []() {Game::getInstance().unpause(); }), PANEL_ALIGN_CENTER);
	}
	m_guiLoadMap = new Container("CONTAINER_LOAD_MAP", {0, 0}, Globals::getInstance().m_screenSize, false);
	{
		m_guiLoadMap->addComponent(new Panel("PANEL_BG2", "Load Zone", {0, -12}, {534, 112}, 0, true), PANEL_ALIGN_CENTER);
		m_guiLoadMap->addComponent(new TextField("TEXTFIELD_WORLD_NAME", "Zone Name", {0, -24}, {32, 1}, 16, 1), PANEL_ALIGN_CENTER);
		m_guiLoadMap->addComponent(new CButton("BUTTON_LOAD", "Load", {-130, 24}, {252, 24}, 16, 1, []() {
			if(Game::getInstance().m_guiLoadMap->findComponent("TEXTFIELD_WORLD_NAME")->getTitle() != "")
			{
				Game::getInstance().m_zoneMap->load(Game::getInstance().m_guiLoadMap->findComponent("TEXTFIELD_WORLD_NAME")->getTitle());
				Game::getInstance().unpause();
			}
		}), PANEL_ALIGN_CENTER);
		m_guiLoadMap->addComponent(new CButton("BUTTON_CANCEL", "Cancel", {130, 24}, {252, 24}, 16, 1, []() {Game::getInstance().unpause(); }), PANEL_ALIGN_CENTER);
	}
	m_guiClearMap = new Container("CONTAINER_CLEAR_MAP", {0, 0}, Globals::getInstance().m_screenSize, false);
	{
		m_guiClearMap->addComponent(new Panel("PANEL_BG2", "Clear Zone (Warning: No Undo)", {0, -12}, {534, 112}, 0, true), PANEL_ALIGN_CENTER);

		m_guiClearMap->addComponent(new CButton("BUTTON_CLEAR", "Clear", {-130, 24}, {252, 24}, 16, 1, []() {
			Game::getInstance().m_zoneMap->createNew();
			Game::getInstance().unpause();
		}), PANEL_ALIGN_CENTER);
		m_guiClearMap->addComponent(new CButton("BUTTON_CANCEL", "Cancel", {130, 24}, {252, 24}, 16, 1, []() {Game::getInstance().unpause(); }), PANEL_ALIGN_CENTER);
	}
	m_guiResizeMap = new Container("CONTAINER_RESIZE_MAP", {0, 0}, Globals::getInstance().m_screenSize, false);
	{
		m_guiResizeMap->addComponent(new Panel("PANEL_BG2", "Resize Zone", {0, -12}, {1220, 112}, 0, true), PANEL_ALIGN_CENTER);
		m_guiResizeMap->addComponent(new CSlider("SLIDER_WIDTH", "Width", {0, -16}, 1024, 1024, 10, 1), PANEL_ALIGN_CENTER);
		m_guiResizeMap->addComponent(new CSlider("SLIDER_HEIGHT", "Height", {0, 4}, 1024, 1024, 10, 1), PANEL_ALIGN_CENTER);
		m_guiResizeMap->addComponent(new CButton("BUTTON_RESIZE", "Resize", {-130, 24}, {252, 24}, 16, 1, []() {
			if(Game::getInstance().m_guiResizeMap->findComponent("SLIDER_WIDTH")->getValue() != 0 && Game::getInstance().m_guiResizeMap->findComponent("SLIDER_HEIGHT")->getValue() != 0)
			{
				Game::getInstance().unpause();
			}
		}), PANEL_ALIGN_CENTER);
		m_guiResizeMap->addComponent(new CButton("BUTTON_CANCEL", "Cancel", {130, 24}, {252, 24}, 16, 1, []() {Game::getInstance().unpause(); }), PANEL_ALIGN_CENTER);
	}
	m_guiExit = new Container("CONTAINER_EXIT", {0, 0}, Globals::getInstance().m_screenSize, false);
	{
		m_guiExit->addComponent(new Panel("PANEL_BG2", "Exit Editor", {0, -12}, {534, 112}, 0, true), PANEL_ALIGN_CENTER);

		m_guiExit->addComponent(new TextField("TEXTFIELD_WORLD_NAME", "Zone Name", {0, -24}, {32, 1}, 16, 1), PANEL_ALIGN_CENTER);
		m_guiExit->addComponent(new CButton("BUTTON_SAVE", "Save", {-173, 24}, {166, 24}, 16, 1, []() {
			if(Game::getInstance().m_guiExit->findComponent("TEXTFIELD_WORLD_NAME")->getTitle() != "")
			{
				Game::getInstance().m_zoneMap->save(Game::getInstance().m_guiExit->findComponent("TEXTFIELD_WORLD_NAME")->getTitle());
				Globals::getInstance().m_exitting = 2;
			}
		}), PANEL_ALIGN_CENTER);
		m_guiExit->addComponent(new CButton("BUTTON_NO_SAVE", "Don't Save", {0, 24}, {166, 24}, 16, 1, []() {Globals::getInstance().m_exitting = 2; }), PANEL_ALIGN_CENTER);
		m_guiExit->addComponent(new CButton("BUTTON_CANCEL", "Cancel", {173, 24}, {166, 24}, 16, 1, []() {
			Game::getInstance().unpause();
			Globals::getInstance().m_exitting = 0;
		}), PANEL_ALIGN_CENTER);
	}

	m_guiPause->addComponent(m_guiSaveMap, PANEL_ALIGN_CENTER);
	m_guiPause->addComponent(m_guiLoadMap, PANEL_ALIGN_CENTER);
	m_guiPause->addComponent(m_guiClearMap, PANEL_ALIGN_CENTER);
	m_guiPause->addComponent(m_guiResizeMap, PANEL_ALIGN_CENTER);
	m_guiPause->addComponent(m_guiExit, PANEL_ALIGN_CENTER);

	m_pauseScreens.push_back(m_guiSaveMap);
	m_pauseScreens.push_back(m_guiLoadMap);
	m_pauseScreens.push_back(m_guiClearMap);
	m_pauseScreens.push_back(m_guiResizeMap);
	m_pauseScreens.push_back(m_guiExit);



	m_listStamps = new CList("LIST_STAMPS", "Stamp List", {16, 208}, {256, 4}, 32, Texture(), 1);
	m_listStamps->addItem({"None", 0});
	m_stamps.push_back(Stamp());
	m_guiRightStamp->addComponent(m_listStamps);

	m_tileSetStamps = new CTileSet("TILESET_WORLD", "TODO: Preview", {0, 88}, {256, 256}, 32, Texture(), 1);
	m_guiRightStamp->addComponent(m_tileSetStamps, PANEL_ALIGN_TOP);

	m_guiTop->addComponent(new CText("TEXT_POS", "1", {0, 0}, {100, 100}, 16, ALIGN_LEFT, Color(255, 255, 255, 255)));

	m_selectStart = {-1, -1};

	return true;
}

void Game::resize()
{
	m_tileMapArea = Rect(-GLfloat(Globals::getInstance().m_screenSize.x / 2), -GLfloat(Globals::getInstance().m_screenSize.y / 2), GLfloat(Globals::getInstance().m_screenSize.x / 2), GLfloat(Globals::getInstance().m_screenSize.y / 2));
}

std::string Game::getZoneName()
{
	return m_zoneMap->getName();
}

void Game::unpause()
{
	if(m_cPauseScreen != -1)
	{
		m_guiPause->setVisible(false);
		m_pauseScreens[m_cPauseScreen]->setVisible(false);
		m_cPauseScreen = -1;
	}
}

void Game::pause(std::string p_screen)
{
	Uint16 i = 0;
	for(i = 0; i < m_pauseScreens.size(); i++)
		if(m_pauseScreens[i]->getName() == p_screen)
		{
			m_guiPause->setVisible(true);
			if(m_cPauseScreen != -1)
				m_pauseScreens[m_cPauseScreen]->setVisible(false);
			m_cPauseScreen = i;
			m_pauseScreens[m_cPauseScreen]->setVisible(true);
			return;
		}
	unpause();
}

std::string Game::getPause()
{
	if(m_cPauseScreen == -1)
		return "";
	return m_pauseScreens[m_cPauseScreen]->getName();
}

void Game::input()
{
	Vector2<Sint32> _mousePos = Globals::getInstance().m_mousePos;
	Sint8 _rValue = 0;
	m_guiAll->input(_rValue, Globals::getInstance().m_keyStates, Globals::getInstance().m_mouseStates, _mousePos);

	if(Globals::getInstance().m_keyStates[GLFW_KEY_ENTER] == 1)
	{
		m_zoneMap->deselect();
	}
	if(Globals::getInstance().m_keyStates[GLFW_KEY_BACKSPACE] == 1)
	{
		m_zoneMap->deleteVertex();
	}

	if((_rValue & 2) != 2 && Globals::getInstance().m_keyStates[GLFW_KEY_G] == 1)
		m_showGrid = !m_showGrid;

	if(Globals::getInstance().m_mouseStates[0] == 1)
	{
		if(m_mouseInArea)
		{
			m_lmbDown = true;
			if(m_selectLayer->getSelectedButton() == 4)
				m_selectStart = {Sint32(floor((m_mouseBuffer.x + m_camPos.x)) - 1), Sint32(floor((m_mouseBuffer.y + m_camPos.y)) - 1)};
		}
	}
	if(Globals::getInstance().m_mouseStates[1] == 1)
	{
		if(m_tileMapArea.checkPoint(GLfloat(m_mouseBuffer.x), GLfloat(m_mouseBuffer.y)))
		{
			m_rmbDown = true;
		}
	}
	if(Globals::getInstance().m_mouseStates[0] == 0)
	{
		m_lmbDown = false;
	}
	if(Globals::getInstance().m_mouseStates[1] == 0)
	{
		m_rmbDown = false;
	}
	if((_rValue & 1) == 0 && m_lmbDown && !m_rmbDown && m_mouseInArea)
	{
		if(!m_zoneMap->objectIsSelected())
		{
			switch(m_selectLayer->getSelectedButton())
			{
			case 0:
				m_zoneMap->addWorldObject(0, ZoneMap::WorldObject("", 1), MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("Stone.png")));
				break;
			case 1:
				m_zoneMap->addWorldObject(1, ZoneMap::WorldObject("", 1), MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("BinaryBrick.png")));
				break;
			case 2:
				m_zoneMap->addWorldObject(2, ZoneMap::WorldObject("", 1), MTexture::getInstance().getUnit(LTexture::getInstance().loadImage("GlitchBrick.png")));
				break;
			case 3:
				// Do stampy things
				break;
			}
		}
		m_zoneMap->addVertex((Vector2<GLfloat>(m_mouseBuffer) / Globals::getInstance().m_zoom + m_camPos));
		m_lmbDown = false;
	}
	else if(m_rmbDown && (_rValue & 1) == 0)
		m_camPos = m_camPos + (Vector2<GLfloat>(m_mouseBuffer) - Vector2<GLfloat>(_mousePos)) / Globals::getInstance().m_zoom;

	m_mouseBuffer = _mousePos;
	m_mouseInArea = ((_rValue & 1) == 0
		&& m_tileMapArea.checkPoint(GLfloat(m_mouseBuffer.x), GLfloat(m_mouseBuffer.y)));

	if(Globals::getInstance().m_mouseScroll > 0)
		Globals::getInstance().m_zoom *= powf(1.01f, GLfloat(Globals::getInstance().m_mouseScroll));
	else if(Globals::getInstance().m_mouseScroll < 0)
		Globals::getInstance().m_zoom /= powf(1.01f, -GLfloat(Globals::getInstance().m_mouseScroll));

	m_zoneMap->setLayerVisible(0, m_guiLeft->findComponent("BUTTON_GROUND_VISIBLE")->isSelected() != 0);
	m_zoneMap->setLayerVisible(1, m_guiLeft->findComponent("BUTTON_WORLD_VISIBLE")->isSelected() != 0);
	m_zoneMap->setLayerVisible(2, m_guiLeft->findComponent("BUTTON_SKY_VISIBLE")->isSelected() != 0);
}

void Game::update()
{
	if(Globals::getInstance().m_keyStates[GLFW_KEY_ESCAPE] == 3)
	{
		if(m_cPauseScreen != -1)
		{
			unpause();
			if(Globals::getInstance().m_exitting == 1)
				Globals::getInstance().m_exitting = 0;
		}
		else
			Globals::getInstance().m_exitting = 1;
	}

	if(Globals::getInstance().m_exitting == 1 && getPause() != "CONTAINER_EXIT")
		pause("CONTAINER_EXIT");

	m_deltaUpdate = GLfloat(glfwGetTime() - m_lastUpdate);
	m_lastUpdate = GLfloat(glfwGetTime());

	m_guiAll->update(m_deltaUpdate);

	if(m_selectLayer->getPrevSelectedButton() != m_selectLayer->getSelectedButton())
	{
		switch(m_selectLayer->getSelectedButton())
		{
		case 0:
			m_guiLeftGround->setVisible(true);
			m_guiRightGround->setVisible(true);
			break;
		case 1:
			m_guiLeftWorld->setVisible(true);
			m_guiRightWorld->setVisible(true);
			break;
		case 2:
			m_guiLeftSky->setVisible(true);
			m_guiRightSky->setVisible(true);
			break;
		case 3:
			m_guiLeftStamp->setVisible(true);
			m_guiRightStamp->setVisible(m_listStamps->getSelectedItem() != 0);
			break;
		}

		switch(m_selectLayer->getPrevSelectedButton())
		{
		case 0:
			m_guiLeftGround->setVisible(false);
			m_guiRightGround->setVisible(false);
			break;
		case 1:
			m_guiLeftWorld->setVisible(false);
			m_guiRightWorld->setVisible(false);
			break;
		case 2:
			m_guiLeftSky->setVisible(false);
			m_guiRightSky->setVisible(false);
			break;
		case 3:
			m_guiLeftStamp->setVisible(false);
			m_guiRightStamp->setVisible(false);
			m_selectStart = {-1, -1};
			break;
		}
	}

	if(m_mouseInArea)
		m_guiTop->findComponent("TEXT_POS")->setTitle("Select Pos\nX:" + Util::numToString(Sint32((Vector2<GLfloat>(m_mouseBuffer) / Globals::getInstance().m_zoom + m_camPos).x)) + "\nY:" + Util::numToString(Sint32((Vector2<GLfloat>(m_mouseBuffer) / Globals::getInstance().m_zoom + m_camPos).y)));
	else
		m_guiTop->findComponent("TEXT_POS")->setTitle("Select Pos\nX:NA\nY:NA");

	m_zoneMap->setViewSize(m_tileMapArea);
	m_zoneMap->setGridVisible(m_showGrid);
}

void Game::render()
{
	glColor3f(1, 1, 1);
	glBindTexture(GL_TEXTURE_2D, m_backTexId.getId());
	glBegin(GL_QUADS);
	{
		glTexCoord2f(0, 1);
		glVertex2f(m_tileMapArea.x, m_tileMapArea.y);
		glTexCoord2f(1, 1);
		glVertex2f(m_tileMapArea.w, m_tileMapArea.y);
		glTexCoord2f(1, 0);
		glVertex2f(m_tileMapArea.w, m_tileMapArea.h);
		glTexCoord2f(0, 0);
		glVertex2f(m_tileMapArea.x, m_tileMapArea.h);
	}
	glEnd();

	glPushMatrix();
	{
		m_zoneMap->render(m_camPos);


		Vector2<Sint32> _topLeft, _botRight;
		_topLeft = Vector2<Sint32>(min(m_selectStart.x, m_selectEnd.x), min(m_selectStart.y, m_selectEnd.y));
		_botRight = Vector2<Sint32>(max(m_selectStart.x, m_selectEnd.x), max(m_selectStart.y, m_selectEnd.y));

		//Selection view
		if(m_selectLayer->getSelectedButton() == 4)
		{
			glPushMatrix();
			{
				if(m_listStamps->getSelectedItem() == 0 && m_selectStart.x != -1)
				{
					glTranslatef(-m_camPos.x, -m_camPos.y, 0);
					glColor4f(0.2f, 0.6f, 1.f, 1.f);
					glBegin(GL_LINES);
					{
						glVertex2f(GLfloat(_topLeft.x), GLfloat(_topLeft.y));
						glVertex2f(GLfloat(_botRight.x), GLfloat(_topLeft.y));

						glVertex2f(GLfloat(_botRight.x), GLfloat(_topLeft.y));
						glVertex2f(GLfloat(_botRight.x), GLfloat(_botRight.y));

						glVertex2f(GLfloat(_botRight.x), GLfloat(_botRight.y));
						glVertex2f(GLfloat(_topLeft.x), GLfloat(_botRight.y));

						glVertex2f(GLfloat(_topLeft.x), GLfloat(_botRight.y));
						glVertex2f(GLfloat(_topLeft.x), GLfloat(_topLeft.y));
					}
					glEnd();
					glColor4f(0.2f, 0.6f, 1.f, 0.2f);
					glBegin(GL_QUADS);
					{
						glVertex2f(GLfloat(_topLeft.x), GLfloat(_topLeft.y));
						glVertex2f(GLfloat(_botRight.x), GLfloat(_topLeft.y));
						glVertex2f(GLfloat(_botRight.x), GLfloat(_botRight.y));
						glVertex2f(GLfloat(_topLeft.x), GLfloat(_botRight.y));
					}
					glEnd();
				}
				else
				{
					Vector2<Sint32> _size = m_stamps[m_listStamps->getSelectedItem()].m_size;
					glColor4f(1, 1, 1, 0.2f);
					glTranslatef(-GLfloat(floor(GLfloat(_size.x) / 2)), -GLfloat(floor(GLfloat(_size.y) / 2)), 0);
					glTranslatef(-GLfloat(fmod((m_mouseBuffer.x + m_camPos.x), 1) - ((m_mouseBuffer.x + m_camPos.x) < 0 ? 1 : 0) - m_mouseBuffer.x), -GLfloat(fmod((m_mouseBuffer.y + m_camPos.y), 1) - ((m_mouseBuffer.y + m_camPos.y) < 0 ? 1 : 0) - m_mouseBuffer.y), 0);
					glBegin(GL_QUADS);
					{
						glVertex2f(0, 0);
						glVertex2f(GLfloat(_size.x), 0);
						glVertex2f(GLfloat(_size.x), GLfloat(_size.y));
						glVertex2f(0, GLfloat(_size.y));
					}
					glEnd();
				}
			}
			glPopMatrix();
		}

		glColor4f(1, 1, 1, 0.2f);
		if(m_mouseInArea && (m_listStamps->getSelectedItem() == 0 || m_selectLayer->getSelectedButton() != 4))
		{
			glTranslatef(-GLfloat(fmod((m_mouseBuffer.x + m_camPos.x), 1) - ((m_mouseBuffer.x + m_camPos.x) < 0 ? 1 : 0) - m_mouseBuffer.x), -GLfloat(fmod((m_mouseBuffer.y + m_camPos.y), 1) - ((m_mouseBuffer.y + m_camPos.y) < 0 ? 1 : 0) - m_mouseBuffer.y), 0);
			glBegin(GL_QUADS);
			{
				glVertex2f(-4, 0);
				glVertex2f(0, -4);
				glVertex2f(4, 0);
				glVertex2f(0, 4);
			}
			glEnd();
		}
	}
	glPopMatrix();

	m_guiAll->render();
}
